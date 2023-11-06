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

    case DateFilters.Last3Months:
      minMoment = moment().subtract(3, "months")
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

  climbLogs.forEach((climb) => {
    const gradeSystem =
      climb.climbType === GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.Boulder]
        ? BOULDER_GRADES
        : INDOOR_SPORT_GRADES
    if (climb.tick === "Attempt") {
      return
    }
    switch (climb.climbType) {
      case GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.Boulder]:
        if (returnGrades.boulder === "") {
          returnGrades.boulder = climb.grade
          break
        }
        const boulderGradeIndex = gradeSystem.indexOf(climb.grade)
        const boulderHardestGradeIndex = gradeSystem.indexOf(
          returnGrades.boulder
        )
        returnGrades.boulder =
          boulderGradeIndex > boulderHardestGradeIndex
            ? climb.grade
            : returnGrades.boulder
        break

      case GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.Lead]:
        if (returnGrades.lead === "") {
          returnGrades.lead = climb.grade
          break
        }
        const leadGradeIndex = gradeSystem.indexOf(climb.grade)
        const leadHardestGradeIndex = gradeSystem.indexOf(returnGrades.lead)
        returnGrades.lead =
          leadGradeIndex > leadHardestGradeIndex
            ? climb.grade
            : returnGrades.lead
        break

      case GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.TopRope]:
        if (returnGrades.topRope === "") {
          returnGrades.topRope = climb.grade
          break
        }
        const topRopeGradeIndex = gradeSystem.indexOf(climb.grade)
        const topRopeHardestGradeIndex = gradeSystem.indexOf(
          returnGrades.topRope
        )
        returnGrades.topRope =
          topRopeGradeIndex > topRopeHardestGradeIndex
            ? climb.grade
            : returnGrades.topRope
        break
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
      sessionStart: Timestamp.fromMillis(sessionStart.unix() * 1000),
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
        climbType: climb.climbType,
        grade: climb.grade,
        tick: climb.tick,
        count: climb.attemptCount,
        unixTime: climb.unixTime,
      })
    } else {
      data.climbs.push({
        climbType: climb.climbType,
        grade: climb.grade,
        tick: climb.tick,
        count: 1,
        unixTime: climb.unixTime,
      })
      if (
        climb.attemptCount > 1 &&
        (climb.tick === "Redpoint" || climb.tick === "Repeat")
      ) {
        data.climbs.push({
          climbType: climb.climbType,
          grade: climb.grade,
          tick: "Attempt",
          count: climb.attemptCount - 1,
          unixTime: climb.unixTime,
        })
      }
    }
  })

  return data
}
