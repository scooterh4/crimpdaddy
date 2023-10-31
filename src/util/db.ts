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
  UserClimbingData,
  UserIndoorRedpointGradesDoc,
  ClimbingSessionData,
} from "../static/types"
import {
  DateFilters,
  GYM_CLIMB_TYPES,
  GradePyramidFilter,
} from "../static/constants"
import moment from "moment"
import {
  assembleGradePyramidGraphData,
  getMinimumMoment,
} from "./data-helper-functions"
import { count } from "console"

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

  try {
    const userDoc = doc(firestore, `/${collectionName}/${userId}`)

    // Check whether the user doc exists, if not, create it
    await getDoc(userDoc).then((document) => {
      if (!document.exists()) {
        const addUser = doc(firestore, `${collectionName}`, userId)

        setDoc(addUser, { userId: userId }).then(() => {
          addDoc(collection(firestore, collectionPath), climbData)
        })
      } else {
        // user doc exists, so just add the climb
        addDoc(collection(firestore, collectionPath), climbData)
      }
    })
  } catch (error) {
    console.log("FIRESTORE Error logging climbing data: ", error)
  }
}

export const logClimbingSession = async (
  climbData: ClimbingSessionData,
  userId: string
): Promise<void> => {
  const collectionPath = `/${collectionName}/${userId}/indoor_sessions`

  try {
    await addDoc(
      collection(firestore, collectionPath),
      climbData.sessionMetadata
    ).then((res) => {
      const climbsPath = collectionPath + `/${res.id}/climbs`
      climbData.climbs.forEach((climb) => {
        addDoc(collection(firestore, climbsPath), climb)
      })
    })
  } catch (error) {
    console.log("FIRESTORE Error logging climbing session: ", error)
  }
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
  const collectionPath = `/${collectionName}/${userId}/indoor_sessions`
  const minMoment = getMinimumMoment(filterRange)

  try {
    console.log("FIRESTORE READ CALL")

    const sessionQuery = query(
      collection(firestore, collectionPath).withConverter(converter()),
      where("sessionStart", ">=", Timestamp.fromDate(minMoment.toDate()))
    )

    const sessions = await getDocs(sessionQuery)

    sessions.forEach((session) => {
      const sessionClimbsPath = collectionPath + `/${session.id}/climbs`
      const docQuery = query(
        collection(firestore, sessionClimbsPath).withConverter(converter())
      )

      getDocs(docQuery).then((docs) => {
        docs.forEach((doc) => {
          const data = doc.data() as ClimbLog
          rawClimbingData.push(data)

          switch (data.climbType) {
            case GYM_CLIMB_TYPES[0]:
              rawBoulderData.push(data)
              break
            case GYM_CLIMB_TYPES[1]:
              rawLeadData.push(data)
              break
            case GYM_CLIMB_TYPES[2]:
              rawTrData.push(data)
              break
          }
        })
      })
    })
  } catch (error) {
    console.log(`FIRESTORE Error retreiving session data:`, error)
  }

  const indoorRedpointGrades = await getUserIndoorRedpointGrades(userId)

  let boulderPyramidData: GradePyramidGraphData[] = []
  let leadPyramidData: GradePyramidGraphData[] = []
  let trPyramidData: GradePyramidGraphData[] = []

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

// get all climbs for a user by type
// export const getAllUserClimbsByType = async (
//   userId: string,
//   climbType: number,
//   filter: number
// ): Promise<OldDocument[]> => {
//   const rawClimbingData: OldDocument[] = []
//   const type = GYM_CLIMB_TYPES[climbType]
//   const collectionPath = `/${collectionName}/${userId}/indoor_${type[0].toLowerCase() +
//     type.slice(1)}`
//   const minMoment = getMinimumMoment(filter)

//   try {
//     console.log("FIRESTORE READ CALL")

//     const q = query(
//       collection(firestore, collectionPath).withConverter(converter()),
//       where("Timestamp", ">=", Timestamp.fromDate(minMoment.toDate())),
//       where("Timestamp", "<=", Timestamp.fromDate(moment().toDate()))
//     )

//     const querySnapshot = await getDocs(q)

//     querySnapshot.forEach((doc) => {
//       rawClimbingData.push(doc.data() as OldDocument)
//     })
//   } catch (error) {
//     console.log(`FIRESTORE Error retreiving ${type} data:`, error)
//   }

//   return rawClimbingData
// }

// ------------------------
// Data migration functions
// ------------------------

// type OldDocument = {
//   Grade: string
//   Tick: string
//   Count: number
//   Timestamp: Timestamp
// }

// export const LogNewClimbSession = async (
//   climbData: ClimbLog[],
//   sessionDate: string,
//   userId: string
// ): Promise<void> => {
//   const collectionPath = `/${collectionName}/${userId}/indoor_sessions`

//   const climbSession = Timestamp.fromDate(
//     moment(sessionDate, "MM-DD-YYYY").toDate()
//   )

//   try {
//     addDoc(collection(firestore, collectionPath), {
//       sessionStart: climbSession,
//     }).then((docRef) => {
//       const climbsPath = collectionPath + `/${docRef.id}/climbs`
//       climbData.forEach((climb) => {
//         addDoc(collection(firestore, climbsPath), climb)
//       })
//     })
//   } catch (error) {
//     console.log("Error logging climbing data: ", error)
//   }
// }

// export const MigrateUser = async (userId: string): Promise<void> => {
//   let sessions: Map<string, ClimbLog[]> = new Map<string, ClimbLog[]>()

//   try {
//     await getAllUserClimbsByType(
//       userId,
//       GYM_CLIMB_TYPES.Boulder,
//       DateFilters.Last12Months
//     )
//       .then((boulderData) => {
//         boulderData.forEach((boulder) => {
//           const boulderDate = moment
//             .unix(boulder.Timestamp.seconds)
//             .format("MM-DD-YYYY")
//           const newBoulder = {
//             climbType: "Boulder",
//             grade: boulder.Grade,
//             tick: boulder.Tick,
//             count: boulder.Count,
//             unixTime: boulder.Timestamp.seconds,
//           }
//           if (sessions.has(boulderDate)) {
//             const others = sessions.get(boulderDate)
//             sessions.set(
//               boulderDate,
//               others ? others.concat(newBoulder) : [newBoulder]
//             )
//           } else {
//             sessions.set(boulderDate, [newBoulder])
//           }
//         })
//       })
//       .then(() => {
//         sessions.forEach((session, key) => {
//           LogNewClimbSession(session, key, userId)
//         })
//       })

//     await getAllUserClimbsByType(
//       userId,
//       GYM_CLIMB_TYPES.TopRope,
//       DateFilters.Last12Months
//     ).then((trData) => {
//       trData.forEach((tr) => {
//         const trDate = moment.unix(tr.Timestamp.seconds).format("MM-DD-YYYY")
//         const newTr = {
//           climbType: "TopRope",
//           grade: tr.Grade,
//           tick: tr.Tick,
//           count: tr.Count,
//           unixTime: tr.Timestamp.seconds,
//         }
//         if (sessions.has(trDate)) {
//           const meow = sessions.get(trDate)
//           sessions.set(trDate, meow ? meow.concat(newTr) : [newTr])
//         } else {
//           sessions.set(trDate, [newTr])
//         }
//       })
//     })
//   } catch (error) {
//     console.log("Error migrating user:", error)
//   }

//   console.log("It worked!")
//   return
// }
