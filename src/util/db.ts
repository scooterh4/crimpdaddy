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
  UserIndoorRedpointGradesDoc,
  ClimbingSessionData,
} from "../static/types"
import { GYM_CLIMB_TYPES, GradePyramidFilter } from "../static/constants"
import moment from "moment"
import {
  assembleGradePyramidGraphData,
  getMinimumMoment,
} from "./data-helper-functions"

const collectionName = "climbingLogs"

const converter = <ClimbLogDocument>() => ({
  toFirestore: (data: Partial<ClimbLogDocument>) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) =>
    snap.data() as ClimbLogDocument,
})

export const getUserIndoorRedpointGrades = async (
  userId: string
): Promise<UserIndoorRedpointGradesDoc> => {
  let redpointGrades: UserIndoorRedpointGradesDoc = {
    boulder: "",
    lead: "",
    topRope: "",
  }
  const collectionPath = `/${collectionName}/${userId}/indoor_summary_stats`

  try {
    console.log("FIRESTORE READ CALL")

    const docRef = doc(firestore, collectionPath, "redpoint_grades")
    const docSnap = await getDoc(docRef)

    if (docSnap.data) {
      redpointGrades = docSnap.data() as UserIndoorRedpointGradesDoc
    }
  } catch (error) {
    console.log(
      `FIRESTORE Error retreiving UserIndoorRedpointGrades data:`,
      error
    )
  }

  return redpointGrades
}

export const updateUserIndoorRedpointGrades = async (
  userId: string,
  updateGrades: UserIndoorRedpointGradesDoc
): Promise<void> => {
  const docPath = `/${collectionName}/${userId}/indoor_summary_stats/redpoint_grades`

  try {
    console.log("FIRESTORE WRITE CALL")

    const docRef = doc(firestore, docPath)

    await setDoc(docRef, updateGrades)
  } catch (error) {
    console.log(
      `FIRESTORE Error updating UserIndoorRedpointGrades data:`,
      error
    )
  }
}

// log an indoor climb
export const logClimb = async (
  climbData: ClimbLog,
  userId: string
): Promise<void> => {
  const collectionPath = `/${collectionName}/${userId}/indoor_${climbData.climbType[0].toLowerCase() +
    climbData.climbType.slice(1)}`

  const newDocument: ClimbLogDocument = {
    grade: climbData.grade,
    tick: climbData.tick,
    count: climbData.count,
    timestamp: Timestamp.fromMillis(climbData.unixTime * 1000),
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
    console.log("FIRESTORE Error logging climbing data: ", error)
  }
}

export const logClimbingSession = async (
  climbData: ClimbingSessionData,
  userId: string
): Promise<void> => {}

// get all climbs for a user by type
export const getAllUserClimbsByType = async (
  userId: string,
  climbType: number,
  filter: number
): Promise<ClimbLogDocument[]> => {
  const rawClimbingData: ClimbLogDocument[] = []
  const type = GYM_CLIMB_TYPES[climbType]
  const collectionPath = `/${collectionName}/${userId}/indoor_${type[0].toLowerCase() +
    type.slice(1)}`
  const minMoment = getMinimumMoment(filter)

  try {
    console.log("FIRESTORE READ CALL")

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
    console.log(`FIRESTORE Error retreiving ${type} data:`, error)
  }

  return rawClimbingData
}

// get all climbs for a user
export const getAllUserClimbingData = async (
  userId: string,
  filterRange: number
): Promise<UserClimbingData> => {
  const rawClimbingData: ClimbLog[] = []
  const rawBoulderData: ClimbLog[] = []
  const rawLeadData: ClimbLog[] = []
  const rawTrData: ClimbLog[] = []

  const boulderData = await getAllUserClimbsByType(
    userId,
    GYM_CLIMB_TYPES.Boulder,
    filterRange
  )
  const leadData = await getAllUserClimbsByType(
    userId,
    GYM_CLIMB_TYPES.Lead,
    filterRange
  )
  const trData = await getAllUserClimbsByType(
    userId,
    GYM_CLIMB_TYPES.TopRope,
    filterRange
  )

  const indoorRedpointGrades = await getUserIndoorRedpointGrades(userId)

  let boulderPyramidData: GradePyramidGraphData[] = []
  let leadPyramidData: GradePyramidGraphData[] = []
  let trPyramidData: GradePyramidGraphData[] = []

  try {
    boulderData.forEach((log) => {
      const addDoc: ClimbLog = {
        climbType: GYM_CLIMB_TYPES[0],
        unixTime: log.timestamp.seconds,
        ...log,
      }
      rawBoulderData.push(addDoc)
      rawClimbingData.push(addDoc)
    })

    leadData.forEach((log) => {
      const addDoc: ClimbLog = {
        climbType: GYM_CLIMB_TYPES[1],
        unixTime: log.timestamp.seconds,
        ...log,
      }
      rawLeadData.push(addDoc)
      rawClimbingData.push(addDoc)
    })

    trData.forEach((log) => {
      const addDoc: ClimbLog = {
        climbType: GYM_CLIMB_TYPES[2],
        unixTime: log.timestamp.seconds,
        ...log,
      }
      rawTrData.push(addDoc)
      rawClimbingData.push(addDoc)
    })

    boulderPyramidData = assembleGradePyramidGraphData(
      rawBoulderData,
      GYM_CLIMB_TYPES.Boulder,
      GradePyramidFilter.ClimbsAndAttempts,
      filterRange
    )
    leadPyramidData = assembleGradePyramidGraphData(
      rawLeadData,
      GYM_CLIMB_TYPES.Lead,
      GradePyramidFilter.ClimbsAndAttempts,
      filterRange
    )
    trPyramidData = assembleGradePyramidGraphData(
      rawTrData,
      GYM_CLIMB_TYPES.TopRope,
      GradePyramidFilter.ClimbsAndAttempts,
      filterRange
    )
  } catch (error) {
    console.log("FIRESTORE Error retreiving all climbing data:", error)
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
    summaryStats: { indoorRedpointGrades: indoorRedpointGrades },
  } as UserClimbingData
}
