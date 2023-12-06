import { Moment } from "moment"
import {
  GYM_CLIMB_TYPES,
  INDOOR_SPORT_GRADES,
  GradePyramidFilter,
  BOULDER_GRADES,
  BOULDER_TICK_TYPES,
  ROUTE_TICK_TYPES,
} from "../../../../static/constants"
import {
  BoulderGradePyramidGraphData,
  RouteGradePyramidGraphData,
  ClimbLog,
  BoulderTickTypes,
  RouteTickTypes,
} from "../../../../static/types"
import { getMinimumMoment } from "../../../../utils/data-helper-functions"

const getGradeOrder = (climbType: number) => {
  return climbType === GYM_CLIMB_TYPES.Boulder
    ? BOULDER_GRADES
    : INDOOR_SPORT_GRADES
}

export function assembleGradePyramidGraphData(
  rawData: ClimbLog[],
  climbType: number,
  gradePyramidFilter?: string,
  dateFilter?: string
): BoulderGradePyramidGraphData[] | RouteGradePyramidGraphData[] {
  const gradeAttemptMap =
    climbType === GYM_CLIMB_TYPES.Boulder
      ? new Map<string, BoulderTickTypes>()
      : new Map<string, RouteTickTypes>()
  const minMoment: Moment | null = dateFilter
    ? getMinimumMoment(dateFilter)
    : null

  rawData.forEach((climb) => {
    // Check the date filter
    if (minMoment && climb.unixTime < minMoment.unix()) return

    if (gradePyramidFilter && gradePyramidFilter !== null) {
      // check the climb type (this is for the session logs)
      // filters out unneeded climbs (very unreadable!)
      if (
        (climb.climbType === GYM_CLIMB_TYPES[0] &&
          climbType === GYM_CLIMB_TYPES.Lead) ||
        (climb.climbType !== GYM_CLIMB_TYPES[0] &&
          climbType === GYM_CLIMB_TYPES.Boulder)
      )
        return

      // Grade pyramids page
      if (
        (gradePyramidFilter !== GradePyramidFilter.ClimbsAndAttempts &&
          gradePyramidFilter === GradePyramidFilter.ClimbsOnly &&
          climb.tick === ROUTE_TICK_TYPES.Attempt) ||
        (gradePyramidFilter === GradePyramidFilter.AttemptsOnly &&
          climb.tick !== ROUTE_TICK_TYPES.Attempt)
      ) {
        return
      }

      // Sessions
      if (
        gradePyramidFilter === GradePyramidFilter.LeadOnly &&
        climb.climbType !== GYM_CLIMB_TYPES[1]
      )
        return

      if (
        gradePyramidFilter === GradePyramidFilter.TrOnly &&
        climb.climbType !== GYM_CLIMB_TYPES[2]
      )
        return
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
