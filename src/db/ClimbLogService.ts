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
  }/${climbData.Timestamp.toDate().getFullYear()}/indoor/${climbData.ClimbType[0].toLowerCase() +
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
  const year = new Date().getFullYear()
  const type = GYM_CLIMB_TYPES[climbType]
  const collectionPath = `/${collectionName}/${userId}/${year}/indoor/${type[0].toLowerCase() +
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
  const boulderData = await GetAllUserClimbsByType(
    userId,
    GYM_CLIMB_TYPES.Boulder
  )
  const leadData = await GetAllUserClimbsByType(userId, GYM_CLIMB_TYPES.Lead)
  const trData = await GetAllUserClimbsByType(userId, GYM_CLIMB_TYPES.TopRope)

  try {
    boulderData.forEach((log) => {
      const addDoc: ClimbLog = {
        UserId: userId,
        ClimbType: GYM_CLIMB_TYPES[0],
        ...log,
      }
      rawClimbingData.push(addDoc)
    })

    leadData.forEach((log) => {
      const addDoc: ClimbLog = {
        UserId: userId,
        ClimbType: GYM_CLIMB_TYPES[1],
        ...log,
      }
      rawClimbingData.push(addDoc)
    })

    trData.forEach((log) => {
      const addDoc: ClimbLog = {
        UserId: userId,
        ClimbType: GYM_CLIMB_TYPES[2],
        ...log,
      }
      rawClimbingData.push(addDoc)
    })
  } catch (error) {
    console.log("Error retreiving all climbing data:", error)
  }

  const gradePyramidData = formatClimbingData(rawClimbingData)

  return {
    climbingData: rawClimbingData,
    gradePyramidData: gradePyramidData,
  } as ClimbingData
}

// // Use if you want to change how the data is structured in firebase
// const MigrateUser = async (userId: string): Promise<void> => {
//   const chillData = GetClimbsByUser(userId).then((res) => {
//     console.log("Climbing data", res.climbingData)

//     // go through each climb and write a document with the desired structure
//     res.climbingData.forEach((climb) => {
//       let collectionPath = `/climbingLogs/${userId}/2023/indoor/`
//       let newDoc: ClimbLogDocument

//       switch (climb.ClimbType) {
//         case "Boulder":
//           collectionPath += "boulder"
//           break
//         case "Lead":
//           collectionPath += "lead"
//           break
//         case "TopRope":
//           collectionPath += "topRope"
//           break
//       }

//       newDoc = {
//         Grade: climb.Grade,
//         Tick: climb.Tick === "Hang" ? "Attempt" : climb.Tick,
//         Count:
//           climb.Tick === "Attempt" || climb.Tick === "Hang"
//             ? climb.Attempts
//             : 1,
//         Timestamp: climb.DateTime,
//       }
//       addDoc(collection(db, collectionPath), newDoc).then((res) => {
//         console.log(`New ${newDoc.Tick} doc added`)
//       })

//       // Need to add the attempts doc for a climb
//       if (climb.Tick !== "Attempt" && climb.Attempts > 1) {
//         const gradeDoc: ClimbLogDocument = {
//           Grade: climb.Grade,
//           Tick: "Attempt",
//           Count: climb.Attempts - 1,
//           Timestamp: climb.DateTime,
//         }
//         addDoc(collection(db, collectionPath), gradeDoc).then((res) => {
//           console.log(`New ${gradeDoc.Tick} doc added`)
//         })
//       }
//     })
//   })
// }

// -----------------
// Helper functions
// -----------------
function formatClimbingData(rawData: ClimbLog[]) {
  const boulderGradeAttemptMap = new Map<string, TickTypes>()
  const leadGradeAttemptMap = new Map<string, TickTypes>()
  const trGradeAttemptMap = new Map<string, TickTypes>()

  rawData.forEach((climb) => {
    const gradeAttemptMap =
      climb.ClimbType === "Boulder"
        ? boulderGradeAttemptMap
        : climb.ClimbType === "Lead"
        ? leadGradeAttemptMap
        : trGradeAttemptMap

    addGradeData(climb, gradeAttemptMap)
  })

  // Get sorted lists of the grades in descending order
  const boulderGrades = Array.from(boulderGradeAttemptMap.keys()).sort((a, b) =>
    b.localeCompare(a)
  )

  const leadGrades = Array.from(leadGradeAttemptMap.keys())
    .sort(
      (a, b) => INDOOR_SPORT_GRADES.indexOf(a) - INDOOR_SPORT_GRADES.indexOf(b)
    )
    .reverse()

  const trGrades = Array.from(trGradeAttemptMap.keys())
    .sort(
      (a, b) => INDOOR_SPORT_GRADES.indexOf(a) - INDOOR_SPORT_GRADES.indexOf(b)
    )
    .reverse()

  // Assemble the data for each graph
  const boulderGraphData = assembleGraphData(
    boulderGrades,
    boulderGradeAttemptMap
  )
  const leadGraphData = assembleGraphData(leadGrades, leadGradeAttemptMap)
  const trGraphData = assembleGraphData(trGrades, trGradeAttemptMap)

  return {
    boulderData: boulderGraphData,
    leadData: leadGraphData,
    trData: trGraphData,
  }
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

  switch (climb.Tick) {
    case "Onsight":
      ticks.Onsight += 1
      break
    case "Flash":
      ticks.Flash += 1
      break
    case "Redpoint":
      ticks.Redpoint += 1
      break
    default:
      break
  }

  ticks.Attempts += climb.Count > 1 ? climb.Count - 1 : 0
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
