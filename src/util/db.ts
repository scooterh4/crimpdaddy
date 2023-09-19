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
  GradePyramidGraphData,
  ClimbLogDocument,
  UserClimbingData,
} from "../types"
import {
  GYM_CLIMB_TYPES,
  MINIMUM_DATE_FOR_DATA,
  DateFilters,
  GradePyramidFilter,
} from "../constants"
import moment from "moment"
import { formatClimbingData } from "./helper-functions"

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

  let boulderPyramidData: GradePyramidGraphData[] = []
  let leadPyramidData: GradePyramidGraphData[] = []
  let trPyramidData: GradePyramidGraphData[] = []

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
      GYM_CLIMB_TYPES.Boulder,
      GradePyramidFilter.ClimbsAndAttempts,
      filterRange
    )
    leadPyramidData = formatClimbingData(
      rawLeadData,
      GYM_CLIMB_TYPES.Lead,
      GradePyramidFilter.ClimbsAndAttempts,
      filterRange
    )
    trPyramidData = formatClimbingData(
      rawTrData,
      GYM_CLIMB_TYPES.TopRope,
      GradePyramidFilter.ClimbsAndAttempts,
      filterRange
    )
  } catch (error) {
    console.log("Error retreiving all climbing data:", error)
  }

  return {
    climbingLogs: {
      allClimbs: rawClimbingData,
      boulderLogs: rawBoulderData,
      leadLogs: rawLeadData,
      topRopeLogs: rawTrData,
    },
    gradePyramidData: {
      boulderData: boulderPyramidData,
      leadData: leadPyramidData,
      trData: trPyramidData,
    },
  } as UserClimbingData
}
