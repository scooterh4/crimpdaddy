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
import { INDOOR_SPORT_GRADES } from "../static/constants"

const collectionName = "climbingLogs"

// log an indoor climb
export const LogClimb = async (climbData: ClimbLog): Promise<string> => {
  const collectionPath = `/${collectionName}/${
    climbData.UserId
  }/${climbData.DateTime.toDate().getFullYear()}/indoor/climbs`

  try {
    const userDoc = doc(db, `/${collectionName}/${climbData.UserId}`)

    // Check whether the user doc exists, if not, create it
    await getDoc(userDoc).then((document) => {
      if (!document.exists()) {
        const addUser = doc(db, `${collectionName}`, climbData.UserId)

        setDoc(addUser, { userId: climbData.UserId }).then(() => {
          console.log("User doc created for user: ", climbData.UserId)

          addDoc(collection(db, collectionPath), climbData).then((res) => {
            console.log("Document written")
          })
        })
      } else {
        // user doc exists, so just add the climb
        addDoc(collection(db, collectionPath), climbData).then((res) => {
          console.log("Document written")
        })
      }
    })
  } catch (error) {
    console.log("Error retreiving all users: ", error)
  }
  return "Success"
}

export type ClimbingData = {
  climbingData: ClimbLog[]
  gradePyramidData: {
    boulderData: ClimbGraphData[]
    leadData: ClimbGraphData[]
    trData: ClimbGraphData[]
  }
}

// get all climbs for a user
export const GetClimbsByUser = async (
  userId: string
): Promise<ClimbingData> => {
  const rawClimbingData: ClimbLog[] = []
  const year = new Date().getFullYear()
  const collectionPath = `/${collectionName}/${userId}/${year}/indoor/climbs`

  try {
    const querySnapshot = await getDocs(collection(db, collectionPath))

    querySnapshot.forEach((doc) => {
      rawClimbingData.push(doc.data() as ClimbLog)
    })
  } catch (error) {
    console.log("Error retreiving all users: ", error)
  }

  const gradePyramidData = formatClimbingData(rawClimbingData)

  return {
    climbingData: rawClimbingData,
    gradePyramidData: gradePyramidData,
  } as ClimbingData
}

type newDocumentStruct = {
  Grade: string
  Tick: string
  Count: number
  Timestamp: Timestamp
}

// Use if you want to change how the data is structured in firebase
const MigrateUser = async (userId: string): Promise<void> => {
  const chillData = GetClimbsByUser(userId).then((res) => {
    console.log("Climbing data", res.climbingData)

    // go through each climb and write a document with the desired structure
    res.climbingData.forEach((climb) => {
      let collectionPath = `/climbingLogs/${userId}/2023/indoor/`
      let newDoc: newDocumentStruct

      switch (climb.ClimbType) {
        case "Boulder":
          collectionPath += "boulder"
          break
        case "Lead":
          collectionPath += "lead"
          break
        case "TopRope":
          collectionPath += "topRope"
          break
      }

      newDoc = {
        Grade: climb.Grade,
        Tick: climb.Tick === "Hang" ? "Attempt" : climb.Tick,
        Count:
          climb.Tick === "Attempt" || climb.Tick === "Hang"
            ? climb.Attempts
            : 1,
        Timestamp: climb.DateTime,
      }
      addDoc(collection(db, collectionPath), newDoc).then((res) => {
        console.log(`New ${newDoc.Tick} doc added`)
      })

      // Need to add the attempts doc for a climb
      if (climb.Tick !== "Attempt" && climb.Attempts > 1) {
        const gradeDoc: newDocumentStruct = {
          Grade: climb.Grade,
          Tick: "Attempt",
          Count: climb.Attempts - 1,
          Timestamp: climb.DateTime,
        }
        addDoc(collection(db, collectionPath), gradeDoc).then((res) => {
          console.log(`New ${gradeDoc.Tick} doc added`)
        })
      }
    })
  })
}

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

  ticks.Attempts += climb.Attempts > 1 ? climb.Attempts - 1 : 0
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
