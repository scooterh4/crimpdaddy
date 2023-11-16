import moment, { Moment } from "moment"
import {
  GYM_CLIMB_TYPES,
  INDOOR_SPORT_GRADES,
  GradePyramidFilter,
  DateFilters,
  BOULDER_GRADES,
  BOULDER_TICK_TYPES,
  ROUTE_TICK_TYPES,
} from "../static/constants"
import {
  BoulderGradePyramidGraphData,
  RouteGradePyramidGraphData,
  ClimbLog,
  UserIndoorRedpointGradesDoc,
  ClimbingSessionData,
  SessionClimb,
  BoulderTickTypes,
  RouteTickTypes,
  ProgressionGraphData,
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
    if (climb.tick === ROUTE_TICK_TYPES.Attempt) {
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
      failedAttempts: 0,
      hardestBoulderClimbed: "",
      hardestRouteClimbed: "",
      sessionStart: Timestamp.fromMillis(sessionStart.unix() * 1000),
      sessionEnd: Timestamp.fromMillis(moment().unix() * 1000),
    },
    climbs: [],
  } as ClimbingSessionData

  sessionClimbs.forEach((climb) => {
    if (climb.attemptCount > 1 || climb.tick === "Attempt") {
      if (climb.tick !== "Attempt") {
        data.sessionMetadata.failedAttempts += climb.attemptCount - 1
      } else {
        data.sessionMetadata.failedAttempts += climb.attemptCount
      }
    }
    switch (climb.climbType) {
      case GYM_CLIMB_TYPES[0]:
        if (climb.tick !== "Attempt") {
          data.sessionMetadata.numberOfBoulders += 1
          data.sessionMetadata.hardestBoulderClimbed =
            BOULDER_GRADES.indexOf(data.sessionMetadata.hardestBoulderClimbed) <
            BOULDER_GRADES.indexOf(climb.grade)
              ? climb.grade
              : data.sessionMetadata.hardestBoulderClimbed
        }
        break

      default:
        if (climb.tick !== "Attempt") {
          data.sessionMetadata.numberOfRoutes += 1
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

// -----------------------------
// Grade pyramid page functions
// -----------------------------
const getGradeOrder = (climbType: number) => {
  return climbType === GYM_CLIMB_TYPES.Boulder
    ? BOULDER_GRADES
    : INDOOR_SPORT_GRADES
}

export function assembleGradePyramidGraphData(
  rawData: ClimbLog[],
  climbType: number,
  gradePyramidFilter?: number,
  dateFilter?: number
): BoulderGradePyramidGraphData[] | RouteGradePyramidGraphData[] {
  const gradeAttemptMap =
    climbType === GYM_CLIMB_TYPES.Boulder
      ? new Map<string, BoulderTickTypes>()
      : new Map<string, RouteTickTypes>()
  const minMoment: Moment | null = dateFilter
    ? getMinimumMoment(dateFilter)
    : null

  rawData.forEach((climb) => {
    // check the climb type (this is for the session logs)
    if (climb.climbType !== GYM_CLIMB_TYPES[climbType]) return

    // Check the date filter
    if (minMoment && climb.unixTime < minMoment.unix()) return

    // check the gradePyramidFilter
    if (
      gradePyramidFilter !== null &&
      gradePyramidFilter !== GradePyramidFilter.ClimbsAndAttempts
    ) {
      if (
        (gradePyramidFilter === GradePyramidFilter.ClimbsOnly &&
          climb.tick === ROUTE_TICK_TYPES.Attempt) ||
        (gradePyramidFilter === GradePyramidFilter.AttemptsOnly &&
          climb.tick !== ROUTE_TICK_TYPES.Attempt)
      ) {
        return
      }
    }

    // climb looks good so add it to the map
    addGradePyramidDataToMap(climb, gradeAttemptMap)
  })

  const grades = Array.from(gradeAttemptMap.keys())
  const gradeOrder = getGradeOrder(climbType)

  grades.sort((a, b) => gradeOrder.indexOf(a) - gradeOrder.indexOf(b)).reverse()

  return assembleGradePyramidData(climbType, grades, gradeAttemptMap)
}

export function addGradePyramidDataToMap(
  climb: ClimbLog,
  gradeAttemptMap: Map<string, BoulderTickTypes | RouteTickTypes>
) {
  let ticks: BoulderTickTypes | RouteTickTypes

  if (climb.climbType === GYM_CLIMB_TYPES[0]) {
    ticks =
      (gradeAttemptMap.get(climb.grade) as BoulderTickTypes) ||
      ({
        flash: 0,
        sends: 0,
        attempts: 0,
      } as BoulderTickTypes)

    // Repeats are not added to grade pyramids
    switch (climb.tick) {
      case BOULDER_TICK_TYPES.Flash:
        ticks.flash += climb.count
        break

      case BOULDER_TICK_TYPES.Send:
        ticks.sends += climb.count
        break

      case BOULDER_TICK_TYPES.Attempt:
        ticks.attempts += climb.count
        break

      default:
        break
    }
  } else {
    ticks =
      (gradeAttemptMap.get(climb.grade) as RouteTickTypes) ||
      ({
        onsight: 0,
        flash: 0,
        redpoint: 0,
        attempts: 0,
      } as RouteTickTypes)

    // Repeats are not added to grade pyramids
    switch (climb.tick) {
      case ROUTE_TICK_TYPES.Onsight:
        ticks.onsight += climb.count
        break

      case ROUTE_TICK_TYPES.Flash:
        ticks.flash += climb.count
        break

      case ROUTE_TICK_TYPES.Redpoint:
        ticks.redpoint += climb.count
        break

      case ROUTE_TICK_TYPES.Attempt:
        ticks.attempts += climb.count
        break

      default:
        break
    }
  }

  gradeAttemptMap.set(climb.grade, ticks)
}

export function assembleGradePyramidData(
  climbType: number,
  gradesArray: string[],
  gradeAttemptMap: Map<string, BoulderTickTypes | RouteTickTypes>
): BoulderGradePyramidGraphData[] | RouteGradePyramidGraphData[] {
  let graphData:
    | BoulderGradePyramidGraphData[]
    | RouteGradePyramidGraphData[] = []

  if (climbType === GYM_CLIMB_TYPES.Boulder) {
    let boulders = graphData as BoulderGradePyramidGraphData[]

    gradesArray.forEach((grade) => {
      const ticks: BoulderTickTypes =
        (gradeAttemptMap.get(grade) as BoulderTickTypes) ||
        ({
          flash: 0,
          sends: 0,
          attempts: 0,
        } as BoulderTickTypes)

      boulders.push({
        grade: grade,
        flash: ticks.flash,
        sends: ticks.sends,
        attempts: ticks.attempts,
      })
    })

    graphData = boulders
  } else {
    let routes = graphData as RouteGradePyramidGraphData[]

    gradesArray.forEach((grade) => {
      const ticks: RouteTickTypes =
        (gradeAttemptMap.get(grade) as RouteTickTypes) ||
        ({
          onsight: 0,
          flash: 0,
          redpoint: 0,
          attempts: 0,
        } as RouteTickTypes)

      routes.push({
        grade: grade,
        onsight: ticks.onsight,
        flash: ticks.flash,
        redpoint: ticks.redpoint,
        attempts: ticks.attempts,
      })
    })

    graphData = routes
  }

  return graphData
}

// ---------------------------
// Progression page functions
// ---------------------------

function getProgressionGraphDataAndXAxis(startMoment: Moment) {
  let graphData: ProgressionGraphData[] = []
  let xAxis: string[] = []
  let month = 0

  while (
    startMoment.month() <= moment().month() ||
    startMoment.year() < moment().year()
  ) {
    const monthToAdd = startMoment.format("MMM YYYY").toString()
    xAxis.push(monthToAdd)

    graphData.push({
      month: monthToAdd,
      monthIdx: month,
      hardestClimbIdx: 0,
      hardestAttemptIdx: 0,
      progressionLine: 0,
    } as ProgressionGraphData)
    startMoment = startMoment.add(1, "month")
    month++
  }

  return { graphData: graphData, xAxis: xAxis }
}

export async function formatDataForProgressionGraph(
  climbingData: ClimbLog[],
  filter: number,
  gradeSystem: string[]
) {
  const startTime =
    filter === DateFilters.Last6Months
      ? moment().subtract(6, "months")
      : moment().subtract(12, "months")

  const { graphData, xAxis } = getProgressionGraphDataAndXAxis(startTime)
  let gradeMaxIndex = 0 // for the y-axis range

  climbingData.forEach((climb) => {
    // All climbs should be in the correct date range
    const month = moment
      .unix(climb.unixTime)
      .format("MMM YYYY")
      .toString()

    const climbMonthAdded = graphData.find((r) => r.month === month)

    if (climbMonthAdded) {
      const climbIdx = gradeSystem.indexOf(climb.grade)
      if (climb.tick !== "Attempt") {
        if (climbMonthAdded.hardestClimbIdx > climbIdx) {
          return
        } else {
          climbMonthAdded.hardestClimbIdx = climbIdx
          climbMonthAdded.progressionLine = climbIdx
        }
      } else {
        if (climbMonthAdded.hardestAttemptIdx > climbIdx) {
          return
        } else {
          climbMonthAdded.hardestAttemptIdx = climbIdx
        }
      }

      // update the grade index for the y-axis range
      gradeMaxIndex = gradeMaxIndex < climbIdx ? climbIdx : gradeMaxIndex
    }
  })

  const firstBarIdx = graphData.findIndex((x) => x.progressionLine)

  graphData.forEach((obj, index) => {
    // calculate the hardestAttempts as the difference between hardestAttemptIdx and hardestClimbIdx
    const attemptValue = Math.max(
      0,
      obj.hardestAttemptIdx - obj.hardestClimbIdx
    )
    obj.hardestAttemptIdx = attemptValue

    // handle empty values after a bar
    if (
      index > 0 &&
      graphData[index - 1].hardestClimbIdx > obj.hardestClimbIdx
    ) {
      obj.progressionLine = graphData[index - 1].hardestClimbIdx
    } else if (index < graphData.length - 1) {
      // handle empty values before a bar
      if (
        graphData[index + 1].hardestClimbIdx > obj.hardestClimbIdx &&
        index > firstBarIdx
      ) {
        obj.progressionLine = graphData[index + 1].hardestClimbIdx
      }
    }
  })

  return {
    gradeRange: [0, gradeMaxIndex + 2],
    graphData: graphData,
    xAxis: xAxis,
  }
}
