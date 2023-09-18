import { GYM_CLIMB_TYPES, INDOOR_SPORT_GRADES } from "../constants"
import { ClimbGraphData, ClimbLog, TickTypes } from "../types"

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
