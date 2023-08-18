import { db } from "../firebase"
import {
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore"
import { ClimbLog, ClimbGraphData, TickTypes } from "../static/types"
import { INDOOR_SPORT_GRADES, GYM_CLIMB_TYPES } from "../static/constants"

const collectionName = "climbingLogs"

export type ClimbLogDocument = {
  Grade: string
  Tick: string
  Count: number
  Timestamp: Timestamp
}

// log an indoor climb
export const LogClimb = async (climbData: ClimbLog): Promise<void> => {
  const collectionPath = `/${collectionName}/${
    climbData.UserId
  }/indoor_${climbData.ClimbType[0].toLowerCase() +
    climbData.ClimbType.slice(1)}`

  const newDocument: ClimbLogDocument = {
    Grade: climbData.Grade,
    Tick: climbData.Tick,
    Count: climbData.Count,
    Timestamp: climbData.Timestamp,
  }

  try {
    const userDoc = doc(db, `/${collectionName}/${climbData.UserId}`)

    // Check whether the user doc exists, if not, create it
    await getDoc(userDoc).then((document) => {
      if (!document.exists()) {
        const addUser = doc(db, `${collectionName}`, climbData.UserId)

        setDoc(addUser, { userId: climbData.UserId }).then(() => {
          console.log("User doc created for user: ", climbData.UserId)

          addDoc(collection(db, collectionPath), newDocument).then((res) => {
            console.log("Document written")
          })
        })
      } else {
        // user doc exists, so just add the climb
        addDoc(collection(db, collectionPath), newDocument).then((res) => {
          console.log("Document written")
        })
      }
    })
  } catch (error) {
    console.log("Error logging climbing data: ", error)
  }
}

export type ClimbingData = {
  climbingData: ClimbLog[]
  gradePyramidData: {
    boulderData: ClimbGraphData[]
    leadData: ClimbGraphData[]
    trData: ClimbGraphData[]
  }
}

// get all climbs for a user by type
export const GetAllUserClimbsByType = async (
  userId: string,
  climbType: number
): Promise<ClimbLogDocument[]> => {
  const rawClimbingData: ClimbLogDocument[] = []
  const type = GYM_CLIMB_TYPES[climbType]
  const collectionPath = `/${collectionName}/${userId}/indoor_${type[0].toLowerCase() +
    type.slice(1)}`

  try {
    const querySnapshot = await getDocs(collection(db, collectionPath))

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
  userId: string
): Promise<ClimbingData> => {
  const rawClimbingData: ClimbLog[] = []
  const rawBoulderData: ClimbLog[] = []
  const rawLeadData: ClimbLog[] = []
  const rawTrData: ClimbLog[] = []

  const boulderData = await GetAllUserClimbsByType(
    userId,
    GYM_CLIMB_TYPES.Boulder
  )
  const leadData = await GetAllUserClimbsByType(userId, GYM_CLIMB_TYPES.Lead)
  const trData = await GetAllUserClimbsByType(userId, GYM_CLIMB_TYPES.TopRope)

  let boulderPyramidData: ClimbGraphData[] = []
  let leadPyramidData: ClimbGraphData[] = []
  let trPyramidData: ClimbGraphData[] = []

  try {
    boulderData.forEach((log) => {
      const addDoc: ClimbLog = {
        UserId: userId,
        ClimbType: GYM_CLIMB_TYPES[0],
        ...log,
      }
      rawBoulderData.push(addDoc)
      rawClimbingData.push(addDoc)
    })

    leadData.forEach((log) => {
      const addDoc: ClimbLog = {
        UserId: userId,
        ClimbType: GYM_CLIMB_TYPES[1],
        ...log,
      }
      rawLeadData.push(addDoc)
      rawClimbingData.push(addDoc)
    })

    trData.forEach((log) => {
      const addDoc: ClimbLog = {
        UserId: userId,
        ClimbType: GYM_CLIMB_TYPES[2],
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
    climbingData: rawClimbingData,
    gradePyramidData: {
      boulderData: boulderPyramidData,
      leadData: leadPyramidData,
      trData: trPyramidData,
    },
  } as ClimbingData
}

// -----------------
// Helper functions
// -----------------
function formatClimbingData(rawData: ClimbLog[], climbType: number) {
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

function addGradeData(
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

function assembleGraphData(
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

//     // Check whether the user doc exists, if not, create it
//     await getDoc(userDoc).then((document) => {
//       if (!document.exists()) {
//         const addUser = doc(db, `${collectionName}`, climbData.UserId)

//         setDoc(addUser, { userId: climbData.UserId }).then(() => {
//           console.log("User doc created for user: ", climbData.UserId)

//           addDoc(collection(db, collectionPath), newDocument).then((res) => {
//             console.log("Document written")
//           })
//         })
//       } else {
//         // user doc exists, so just add the climb
//         addDoc(collection(db, collectionPath), newDocument).then((res) => {
//           console.log("Document written")
//         })
//       }
//     })
//   } catch (error) {
//     console.log("Error logging climbing data: ", error)
//   }
// }

// export const MigrateUser = async (userId: string): Promise<void> => {
//   // const newBoulderPath = `/${collectionName}/${
//   //   userId
//   // }/indoor_boulder`
//   // const newLeadPath = `/${collectionName}/${
//   //   userId
//   // }/indoor_lead`
//   // const newTrPath = `/${collectionName}/${
//   //   userId
//   // }/indoor_topRope`

//   try {
//     await GetAllUserClimbsByType(userId, GYM_CLIMB_TYPES.Boulder, 2023).then(
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

//     await GetAllUserClimbsByType(userId, GYM_CLIMB_TYPES.Lead, 2023).then(
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

//     await GetAllUserClimbsByType(userId, GYM_CLIMB_TYPES.TopRope, 2023).then(
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
