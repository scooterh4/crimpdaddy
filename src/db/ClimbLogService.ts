import { firestore } from "../firebase"
import {
  doc,
  getDoc,
  addDoc,
  setDoc,
  getDocs,
  Timestamp,
  query,
  where,
  QueryDocumentSnapshot,
  collection,
} from "firebase/firestore"
import {
  ClimbLog,
  ClimbGraphData,
  TickTypes,
  ClimbLogDocument,
  UserClimbingData,
} from "../static/types"
import {
  INDOOR_SPORT_GRADES,
  GYM_CLIMB_TYPES,
  MINIMUM_DATE_FOR_DATA,
  DateFilters,
} from "../static/constants"
import moment from "moment"

const collectionName = "climbingLogs"

const converter = <ClimbLogDocument>() => ({
  toFirestore: (data: Partial<ClimbLogDocument>) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) =>
    snap.data() as ClimbLogDocument,
})

// const dataPoint = <T>(collectionPath: string) =>
//   collection(firestore, collectionPath).withConverter(converter())

// const userData = {
//   user: (userId: string, climbType: number) =>
//     dataPoint<ClimbLogDocument>(
//       `climbingLogs/${userId}/indoor_${
//         climbType === 0 ? "boulder" : climbType === 1 ? "lead" : "topRope"
//       }`
//     ),
// }

// export { userData }

// log an indoor climb
export const LogClimb = async (
  climbData: ClimbLog,
  userId: string
): Promise<void> => {
  const collectionPath = `/${collectionName}/${userId}/indoor_${climbData.ClimbType[0].toLowerCase() +
    climbData.ClimbType.slice(1)}`

  const newDocument: ClimbLogDocument = {
    Grade: climbData.Grade,
    Tick: climbData.Tick,
    Count: climbData.Count,
    Timestamp: Timestamp.fromMillis(climbData.UnixTime * 1000),
  }

  try {
    const userDoc = doc(firestore, `/${collectionName}/${userId}`)

    // Check whether the user doc exists, if not, create it
    await getDoc(userDoc).then((document) => {
      if (!document.exists()) {
        const addUser = doc(firestore, `${collectionName}`, userId)

        setDoc(addUser, { userId: userId }).then(() => {
          console.log("User doc created for user: ", userId)

          addDoc(collection(firestore, collectionPath), newDocument)
        })
      } else {
        // user doc exists, so just add the climb
        addDoc(collection(firestore, collectionPath), newDocument)
      }
    })
  } catch (error) {
    console.log("Error logging climbing data: ", error)
  }
}

// get all climbs for a user by type
export const GetAllUserClimbsByType = async (
  userId: string,
  climbType: number,
  filter: number
): Promise<ClimbLogDocument[]> => {
  const rawClimbingData: ClimbLogDocument[] = []
  const type = GYM_CLIMB_TYPES[climbType]
  const collectionPath = `/${collectionName}/${userId}/indoor_${type[0].toLowerCase() +
    type.slice(1)}`
  const minDataMoment = moment(
    MINIMUM_DATE_FOR_DATA.dateString,
    MINIMUM_DATE_FOR_DATA.formatString
  )

  let minMoment = moment()

  switch (filter) {
    case DateFilters.ThisWeek:
      minMoment = minMoment.subtract(7, "days")
      minMoment = minMoment < minDataMoment ? minDataMoment : minMoment
      break

    case DateFilters.ThisMonth:
      minMoment = minMoment.subtract(1, "month")
      minMoment = minMoment < minDataMoment ? minDataMoment : minMoment
      break

    case DateFilters.LastMonth:
      minMoment = minMoment.subtract(2, "months")
      minMoment = minMoment < minDataMoment ? minDataMoment : minMoment
      break

    case DateFilters.Last6Months:
      minMoment = minMoment.subtract(6, "months")
      minMoment = minMoment < minDataMoment ? minDataMoment : minMoment
      break

    case DateFilters.Last12Months:
      minMoment = minMoment.subtract(12, "months")
      minMoment = minMoment < minDataMoment ? minDataMoment : minMoment
      break
  }

  try {
    console.log("FIRESTORE call")

    const q = query(
      collection(firestore, collectionPath).withConverter(converter()),
      where("Timestamp", ">=", Timestamp.fromDate(minMoment.toDate())),
      where("Timestamp", "<=", Timestamp.fromDate(moment().toDate()))
    )

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      rawClimbingData.push(doc.data() as ClimbLogDocument)
    })
  } catch (error) {
    console.log(`Error retreiving ${type} data:`, error)
  }

  return rawClimbingData
}

// get all climbs for a user
export const GetAllUserClimbs = async (
  userId: string,
  filterRange: number
): Promise<UserClimbingData> => {
  const rawClimbingData: ClimbLog[] = []
  const rawBoulderData: ClimbLog[] = []
  const rawLeadData: ClimbLog[] = []
  const rawTrData: ClimbLog[] = []

  const boulderData = await GetAllUserClimbsByType(
    userId,
    GYM_CLIMB_TYPES.Boulder,
    filterRange
  )
  const leadData = await GetAllUserClimbsByType(
    userId,
    GYM_CLIMB_TYPES.Lead,
    filterRange
  )
  const trData = await GetAllUserClimbsByType(
    userId,
    GYM_CLIMB_TYPES.TopRope,
    filterRange
  )

  let boulderPyramidData: ClimbGraphData[] = []
  let leadPyramidData: ClimbGraphData[] = []
  let trPyramidData: ClimbGraphData[] = []

  try {
    boulderData.forEach((log) => {
      const addDoc: ClimbLog = {
        ClimbType: GYM_CLIMB_TYPES[0],
        UnixTime: log.Timestamp.seconds,
        ...log,
      }
      rawBoulderData.push(addDoc)
      rawClimbingData.push(addDoc)
    })

    leadData.forEach((log) => {
      const addDoc: ClimbLog = {
        ClimbType: GYM_CLIMB_TYPES[1],
        UnixTime: log.Timestamp.seconds,
        ...log,
      }
      rawLeadData.push(addDoc)
      rawClimbingData.push(addDoc)
    })

    trData.forEach((log) => {
      const addDoc: ClimbLog = {
        ClimbType: GYM_CLIMB_TYPES[2],
        UnixTime: log.Timestamp.seconds,
        ...log,
      }
      rawTrData.push(addDoc)
      rawClimbingData.push(addDoc)
    })

    boulderPyramidData = formatClimbingData(
      rawBoulderData,
      GYM_CLIMB_TYPES.Boulder
    )
    leadPyramidData = formatClimbingData(rawLeadData, GYM_CLIMB_TYPES.Lead)
    trPyramidData = formatClimbingData(rawTrData, GYM_CLIMB_TYPES.TopRope)
  } catch (error) {
    console.log("Error retreiving all climbing data:", error)
  }

  return {
    climbingLogs: rawClimbingData,
    gradePyramidData: {
      boulderData: boulderPyramidData,
      leadData: leadPyramidData,
      trData: trPyramidData,
    },
  } as UserClimbingData
}

// -----------------
// Helper functions
// -----------------
export function formatClimbingData(rawData: ClimbLog[], climbType: number) {
  const gradeAttemptMap = new Map<string, TickTypes>()

  rawData.forEach((climb) => {
    addGradeData(climb, gradeAttemptMap)
  })

  const grades = Array.from(gradeAttemptMap.keys())

  // Sort the list of the grades in descending order
  if (climbType === GYM_CLIMB_TYPES.Boulder) {
    grades.sort((a, b) => b.localeCompare(a))
  } else {
    grades
      .sort(
        (a, b) =>
          INDOOR_SPORT_GRADES.indexOf(a) - INDOOR_SPORT_GRADES.indexOf(b)
      )
      .reverse()
  }

  const graphData = assembleGraphData(grades, gradeAttemptMap)

  return graphData
}

export function addGradeData(
  climb: ClimbLog,
  gradeAttemptMap: Map<string, TickTypes>
) {
  const ticks = gradeAttemptMap.get(climb.Grade) || {
    Onsight: 0,
    Flash: 0,
    Redpoint: 0,
    Attempts: 0,
  }

  // Repeats are not added to grade pyramids
  switch (climb.Tick) {
    case "Onsight":
      ticks.Onsight += climb.Count
      break
    case "Flash":
      ticks.Flash += climb.Count
      break
    case "Redpoint":
      ticks.Redpoint += climb.Count
      break
    case "Attempt":
      ticks.Attempts += climb.Count
      break
    default:
      break
  }

  gradeAttemptMap.set(climb.Grade, ticks)
}

export function assembleGraphData(
  gradesArray: string[],
  gradeAttemptMap: Map<string, TickTypes>
): ClimbGraphData[] {
  const graphData: ClimbGraphData[] = []

  gradesArray.forEach((grade) => {
    const ticks: TickTypes = gradeAttemptMap.get(grade) || {
      Onsight: 0,
      Flash: 0,
      Redpoint: 0,
      Attempts: 0,
    }

    graphData.push({
      Grade: grade,
      Onsight: ticks.Onsight,
      Flash: ticks.Flash,
      Redpoint: ticks.Redpoint,
      Attempts: ticks.Attempts,
    })
  })

  return graphData
}

// ------------------------
// Data migration functions
// ------------------------
// export const LogNewClimbStructure = async (
//   climbData: ClimbLog
// ): Promise<void> => {
//   const collectionPath = `/${collectionName}/${
//     climbData.UserId
//   }/indoor_${climbData.ClimbType[0].toLowerCase() +
//     climbData.ClimbType.slice(1)}`

//   const newDocument: ClimbLogDocument = {
//     Grade: climbData.Grade,
//     Tick: climbData.Tick,
//     Count: climbData.Count,
//     Timestamp: climbData.Timestamp,
//   }

//   try {
//     const userDoc = doc(db, `/${collectionName}/${climbData.UserId}`)

//     await getDoc(userDoc)
//       .then((document) => {
//         // Check whether the user doc exists, if not, create it
//         if (!document.exists()) {
//           setDoc(doc(db, `${collectionName}`, climbData.UserId), {
//             userId: climbData.UserId,
//           })
//         }
//       })
//       .then(() => {
//         // Add the new data
//         setDoc(
//           doc(db, collectionPath, newDocument.Timestamp.seconds.toString()),
//           newDocument
//         )
//       })
//   } catch (error) {
//     console.log("Error logging climbing data: ", error)
//   }
// }

// export const MigrateUser = async (userId: string): Promise<void> => {
//   try {
//     await GetAllUserClimbsByType(userId, GYM_CLIMB_TYPES.Boulder).then(
//       (boulderData) => {
//         let boulders = 0
//         boulderData.forEach((boulder) => {
//           const addDoc: ClimbLog = {
//             UserId: userId,
//             ClimbType: GYM_CLIMB_TYPES[0],
//             ...boulder,
//           }
//           LogNewClimbStructure(addDoc)
//           boulders++
//         })

//         console.log("Migrated this many boulders:", boulders)
//       }
//     )

//     await GetAllUserClimbsByType(userId, GYM_CLIMB_TYPES.Lead).then(
//       (leadData) => {
//         let leads = 0
//         leadData.forEach((boulder) => {
//           const addDoc: ClimbLog = {
//             UserId: userId,
//             ClimbType: GYM_CLIMB_TYPES[1],
//             ...boulder,
//           }
//           LogNewClimbStructure(addDoc)
//           leads++
//         })

//         console.log("Migrated this many leads:", leads)
//       }
//     )

//     await GetAllUserClimbsByType(userId, GYM_CLIMB_TYPES.TopRope).then(
//       (trData) => {
//         let trs = 0
//         trData.forEach((boulder) => {
//           const addDoc: ClimbLog = {
//             UserId: userId,
//             ClimbType: GYM_CLIMB_TYPES[2],
//             ...boulder,
//           }
//           LogNewClimbStructure(addDoc)
//           trs++
//         })

//         console.log("Migrated this many trs:", trs)
//       }
//     )
//   } catch (error) {
//     console.log("Error migrating user:", error)
//   }
//   console.log("It worked!")
//   return
// }
