import moment, { Moment } from "moment"
import {
  GYM_CLIMB_TYPES,
  INDOOR_SPORT_GRADES,
  GradePyramidFilter,
  DateFilters,
  BOULDER_GRADES,
} from "../static/constants"
import {
  GradePyramidGraphData,
  ClimbLog,
  TickTypes,
  UserIndoorRedpointGradesDoc,
  ClimbingSessionData,
  SessionClimb,
} from "../static/types"
import { Timestamp } from "firebase/firestore"

export function getMinimumMoment(dateFilter: number) {
  let minMoment = moment()

  switch (dateFilter) {
    case DateFilters.ThisWeek:
      minMoment = moment().subtract(6, "days")
      break

    case DateFilters.ThisMonth:
      minMoment = moment().subtract(1, "months")
      break

    case DateFilters.Last6Months:
      minMoment = moment().subtract(6, "months")
      break

    case DateFilters.Last12Months:
      minMoment = moment().subtract(12, "months")
      break
  }

  return minMoment
}

export function assembleGradePyramidGraphData(
  rawData: ClimbLog[],
  climbType: number,
  gradePyramidFilter: number,
  dateFilter: number
): GradePyramidGraphData[] {
  const gradeAttemptMap = new Map<string, TickTypes>()
  const minMoment = getMinimumMoment(dateFilter)

  rawData.forEach((climb) => {
    // check the gradePyramidFilter
    if (gradePyramidFilter !== GradePyramidFilter.ClimbsAndAttempts) {
      if (
        (gradePyramidFilter === GradePyramidFilter.ClimbsOnly &&
          climb.tick === "Attempt") ||
        (gradePyramidFilter === GradePyramidFilter.AttemptsOnly &&
          climb.tick !== "Attempt")
      ) {
        return
      }
    }
    // Check the date filter
    if (climb.unixTime < minMoment.unix()) {
      return
    }

    addGradePyramidDataToMap(climb, gradeAttemptMap)
  })

  const grades = Array.from(gradeAttemptMap.keys())

  // Sort the list of the grades in descending order
  if (climbType === GYM_CLIMB_TYPES.Boulder) {
    grades
      .sort((a, b) => BOULDER_GRADES.indexOf(a) - BOULDER_GRADES.indexOf(b))
      .reverse()
  } else {
    grades
      .sort(
        (a, b) =>
          INDOOR_SPORT_GRADES.indexOf(a) - INDOOR_SPORT_GRADES.indexOf(b)
      )
      .reverse()
  }

  const graphData = assembleGradePyramidData(grades, gradeAttemptMap)

  return graphData
}

export function addGradePyramidDataToMap(
  climb: ClimbLog,
  gradeAttemptMap: Map<string, TickTypes>
) {
  const ticks = gradeAttemptMap.get(climb.grade) || {
    onsight: 0,
    flash: 0,
    redpoint: 0,
    attempts: 0,
  }

  // Repeats are not added to grade pyramids
  switch (climb.tick) {
    case "Onsight":
      ticks.onsight += climb.count
      break
    case "Flash":
      ticks.flash += climb.count
      break
    case "Redpoint":
      ticks.redpoint += climb.count
      break
    case "Attempt":
      ticks.attempts += climb.count
      break
    default:
      break
  }

  gradeAttemptMap.set(climb.grade, ticks)
}

export function assembleGradePyramidData(
  gradesArray: string[],
  gradeAttemptMap: Map<string, TickTypes>
): GradePyramidGraphData[] {
  const graphData: GradePyramidGraphData[] = []

  gradesArray.forEach((grade) => {
    const ticks: TickTypes = gradeAttemptMap.get(grade) || {
      onsight: 0,
      flash: 0,
      redpoint: 0,
      attempts: 0,
    }

    graphData.push({
      grade: grade,
      onsight: ticks.onsight,
      flash: ticks.flash,
      redpoint: ticks.redpoint,
      attempts: ticks.attempts,
    })
  })

  return graphData
}

export function findNewRedpointGrades(
  currentHardestGrades: UserIndoorRedpointGradesDoc | null,
  climbLogs: ClimbLog[]
): UserIndoorRedpointGradesDoc {
  let returnGrades = currentHardestGrades
    ? currentHardestGrades
    : { boulder: "", lead: "", topRope: "" }
  let updateGrade = ""
  // Assuming all climbs are of the same type
  // with the current climb-logging design this should be true
  const gradeSystem =
    climbLogs[0].climbType === GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.Boulder]
      ? BOULDER_GRADES
      : INDOOR_SPORT_GRADES

  climbLogs.forEach((climb) => {
    if (climb.tick === "Attempt") {
      return
    } else {
      if (!currentHardestGrades) {
        switch (climb.climbType) {
          case GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.Boulder]:
            returnGrades = {
              boulder: climb.grade,
              lead: "",
              topRope: "",
            }
            break

          case GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.Lead]:
            returnGrades = {
              boulder: "",
              lead: climb.grade,
              topRope: "",
            }
            break

          case GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.TopRope]:
            returnGrades = {
              boulder: "",
              lead: "",
              topRope: climb.grade,
            }
            break
        }
      } else {
        switch (climb.climbType) {
          case GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.Boulder]:
            const boulderGradeIndex = gradeSystem.indexOf(climb.grade)
            const boulderHardestGradeIndex = gradeSystem.indexOf(
              currentHardestGrades.boulder
            )
            updateGrade =
              boulderGradeIndex > boulderHardestGradeIndex
                ? climb.grade
                : currentHardestGrades.boulder
            returnGrades.boulder = updateGrade
            break

          case GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.Lead]:
            const leadGradeIndex = gradeSystem.indexOf(climb.grade)
            const leadHardestGradeIndex = gradeSystem.indexOf(
              currentHardestGrades.lead
            )
            updateGrade =
              leadGradeIndex > leadHardestGradeIndex
                ? climb.grade
                : currentHardestGrades.lead
            returnGrades.lead = updateGrade
            break

          case GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.TopRope]:
            const trGradeIndex = gradeSystem.indexOf(climb.grade)
            const trHardestGradeIndex = gradeSystem.indexOf(
              currentHardestGrades.topRope
            )
            updateGrade =
              trGradeIndex > trHardestGradeIndex
                ? climb.grade
                : currentHardestGrades.topRope
            returnGrades.topRope = updateGrade
            break
        }
      }
    }
  })

  return returnGrades
}

export function assembleUserSessionData(
  sessionStart: Moment,
  sessionClimbs: SessionClimb[]
): ClimbingSessionData {
  let data = {
    sessionMetadata: {
      numberOfBoulders: 0,
      numberOfRoutes: 0,
      hardestBoulderClimbed: "",
      hardestRouteClimbed: "",
      timestamp: Timestamp.fromMillis(sessionStart.unix() * 1000),
    },
    climbs: [],
  } as ClimbingSessionData

  sessionClimbs.forEach((climb) => {
    switch (climb.climbType) {
      case GYM_CLIMB_TYPES[0]:
        data.sessionMetadata.numberOfBoulders += 1
        if (climb.tick !== "Attempt") {
          data.sessionMetadata.hardestBoulderClimbed =
            BOULDER_GRADES.indexOf(data.sessionMetadata.hardestBoulderClimbed) <
            BOULDER_GRADES.indexOf(climb.grade)
              ? climb.grade
              : data.sessionMetadata.hardestBoulderClimbed
        }
        break
      default:
        data.sessionMetadata.numberOfRoutes += 1
        if (climb.tick !== "Attempt") {
          data.sessionMetadata.hardestRouteClimbed =
            INDOOR_SPORT_GRADES.indexOf(
              data.sessionMetadata.hardestRouteClimbed
            ) < INDOOR_SPORT_GRADES.indexOf(climb.grade)
              ? climb.grade
              : data.sessionMetadata.hardestRouteClimbed
        }
        break
    }

    if (climb.tick === "Attempt") {
      data.climbs.push({
        ...climb,
        count: climb.attemptCount,
        timestamp: Timestamp.fromMillis(climb.unixTime * 1000),
      })
    } else {
      data.climbs.push({
        ...climb,
        count: 1,
        timestamp: Timestamp.fromMillis(climb.unixTime * 1000),
      })
      if (
        climb.attemptCount > 1 &&
        (climb.tick === "Redpoint" || climb.tick === "Repeat")
      ) {
        data.climbs.push({
          ...climb,
          count: climb.attemptCount - 1,
          timestamp: Timestamp.fromMillis(climb.unixTime * 1000),
        })
      }
    }
  })

  return data
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
