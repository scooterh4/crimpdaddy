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
  orderBy,
  QuerySnapshot,
  DocumentData,
  runTransaction,
} from "firebase/firestore"
import {
  ClimbLog,
  UserSessionStorageData,
  UserIndoorRedpointGradesDoc,
  ClimbingSessionData,
  ClimbingSessionMetadata,
} from "../static/types"
import { GYM_CLIMB_TYPES } from "../static/constants"
import { getMinimumMoment } from "./data-helper-functions"

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
): Promise<UserIndoorRedpointGradesDoc> => {
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

  return updateGrades
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
  userId: string,
  climbData: ClimbingSessionData,
  redpointGrades: UserIndoorRedpointGradesDoc
): Promise<void> => {
  const collectionPath = `/${collectionName}/${userId}/indoor_sessions`

  try {
    await runTransaction(firestore, async (t) => {
      updateUserIndoorRedpointGrades(userId, redpointGrades)

      addDoc(
        collection(firestore, collectionPath),
        climbData.sessionMetadata
      ).then((res) => {
        const climbsPath = collectionPath + `/${res.id}/climbs`
        climbData.climbs.forEach((climb) => {
          addDoc(collection(firestore, climbsPath), climb)
        })
      })
    })
  } catch (error) {
    console.log("FIRESTORE Error logging climbing session: ", error)
  }
}

// get all climbs for a user
export const getAllUserClimbingData = async (
  userId: string,
  filterRange: string
): Promise<UserSessionStorageData> => {
  const rawClimbingData: ClimbLog[] = []
  const rawBoulderData: ClimbLog[] = []
  const rawLeadData: ClimbLog[] = []
  const rawTrData: ClimbLog[] = []
  const climbingSessions: ClimbingSessionData[] = []
  const collectionPath = `/${collectionName}/${userId}/indoor_sessions`
  const minMoment = getMinimumMoment(filterRange)

  try {
    console.log("FIRESTORE READ CALL")
    await runTransaction(firestore, async (t) => {
      const sessionQuery = query(
        collection(firestore, collectionPath).withConverter(converter()),
        where("sessionStart", ">=", Timestamp.fromDate(minMoment.toDate()))
      )

      const sessions = await getDocs(sessionQuery)

      sessions.forEach((session) => {
        const seshData: ClimbingSessionMetadata = session.data() as ClimbingSessionMetadata
        climbingSessions.push({
          sessionMetadata: {
            sessionId: session.id,
            hardestBoulderClimbed: seshData.hardestBoulderClimbed,
            hardestRouteClimbed: seshData.hardestRouteClimbed,
            numberOfBoulders: seshData.numberOfBoulders,
            numberOfRoutes: seshData.numberOfRoutes,
            failedAttempts: seshData.failedAttempts,
            sessionStart: seshData.sessionStart,
            sessionEnd: seshData.sessionEnd,
          },
          climbs: [],
        })
        const sessionClimbsPath = collectionPath + `/${session.id}/climbs`
        const docQuery = query(
          collection(firestore, sessionClimbsPath).withConverter(converter())
        )

        getDocs(docQuery).then((docs) => {
          docs.forEach((doc) => {
            const data = doc.data() as ClimbLog
            rawClimbingData.push(data)
            const sesh = climbingSessions.filter((s) => {
              return s.sessionMetadata.sessionId === session.id
            })
            if (sesh) {
              sesh[0].climbs
                ? sesh[0].climbs.push(data)
                : (sesh[0].climbs = [data])
            }

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
    })
  } catch (error) {
    console.log(`FIRESTORE Transaction Error retreiving session data:`, error)
  }

  const indoorRedpointGrades = await getUserIndoorRedpointGrades(userId)

  climbingSessions.sort(
    (a, b) => b.sessionMetadata.sessionStart - a.sessionMetadata.sessionStart
  )

  return {
    sessions: climbingSessions,
    allClimbs: rawClimbingData,
    boulderLogs: rawBoulderData,
    leadLogs: rawLeadData,
    topRopeLogs: rawTrData,
    indoorRedpointGrades: indoorRedpointGrades,
  } as UserSessionStorageData
}

export const getUserClimbingSessionsIds = async (
  userId: string
): Promise<ClimbingSessionMetadata[]> => {
  const collectionPath = `/${collectionName}/${userId}/indoor_sessions`
  let returnData: ClimbingSessionMetadata[] = []
  const sessionQuery = query(
    collection(firestore, collectionPath),
    orderBy("sessionStart", "desc")
  )

  try {
    console.log("FIRESTORE READ CALL")
    const res = await getDocs(sessionQuery)
    res.forEach((r) => {
      const data = r.data() as ClimbingSessionMetadata
      returnData.push({ ...data, sessionId: r.id })
    })
  } catch (error) {
    console.log("FIRESTORE Error getting user climbing session ids: ", error)
  }

  return returnData
}

export type ClimbingSessionDocs = {
  sessionId: string
  climbs: ClimbLog[]
}
export const getUserClimbingSessions = async (
  userId: string,
  sessionIds: string[]
): Promise<ClimbingSessionDocs[]> => {
  let returnData: ClimbingSessionDocs[] = []
  let promises: Promise<QuerySnapshot<DocumentData>>[] = []

  sessionIds.forEach((id) => {
    returnData.push({ sessionId: id, climbs: [] })
    const collectionPath = `/${collectionName}/${userId}/indoor_sessions/${id}/climbs`
    const sessionQuery = query(collection(firestore, collectionPath))
    promises.push(getDocs(sessionQuery))
  })

  try {
    console.log("FIRESTORE READ CALL")
    await Promise.all(promises).then((results) => {
      // the docs claim that: Returned values will be in order of the Promises passed, regardless of completion order.
      results.forEach((result, index) => {
        result.forEach((doc) => {
          returnData[index].climbs.push(doc.data() as ClimbLog)
        })
      })
    })
  } catch (error) {
    console.log("FIRESTORE Error getting user climbing sessions: ", error)
  }

  return returnData
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