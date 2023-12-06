import moment, { Moment } from "moment"
import {
  GYM_CLIMB_TYPES,
  INDOOR_SPORT_GRADES,
  BOULDER_GRADES,
  ROUTE_TICK_TYPES,
} from "../../../../static/constants"
import {
  ClimbLog,
  UserIndoorRedpointGradesDoc,
  SessionClimb,
  ClimbingDataToAdd,
} from "../../../../static/types"
import { Timestamp } from "firebase/firestore"

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
): ClimbingDataToAdd {
  let data = {
    sessionMetadata: {
      sessionId: "",
      numberOfBoulders: 0,
      numberOfRoutes: 0,
      failedAttempts: 0,
      hardestBoulderClimbed: "",
      hardestRouteClimbed: "",
      sessionStart: Timestamp.fromMillis(sessionStart.unix() * 1000),
      sessionEnd: Timestamp.fromMillis(moment().unix() * 1000),
    },
    climbs: [],
    boulders: [],
    lead: [],
    topRope: [],
    newRedpointGrades: { boulder: "", lead: "", topRope: "" },
  } as ClimbingDataToAdd

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
        data.boulders.push({
          climbType: climb.climbType,
          grade: climb.grade,
          tick: climb.tick,
          count: climb.climbType === "Attempt" ? climb.attemptCount : 1,
          unixTime: climb.unixTime,
        })
        break

      case GYM_CLIMB_TYPES[1]:
        if (climb.tick !== "Attempt") {
          data.sessionMetadata.numberOfBoulders += 1
          data.sessionMetadata.hardestBoulderClimbed =
            BOULDER_GRADES.indexOf(data.sessionMetadata.hardestBoulderClimbed) <
            BOULDER_GRADES.indexOf(climb.grade)
              ? climb.grade
              : data.sessionMetadata.hardestBoulderClimbed
        }
        data.lead.push({
          climbType: climb.climbType,
          grade: climb.grade,
          tick: climb.tick,
          count: climb.climbType === "Attempt" ? climb.attemptCount : 1,
          unixTime: climb.unixTime,
        })
        break

      case GYM_CLIMB_TYPES[2]:
        if (climb.tick !== "Attempt") {
          data.sessionMetadata.numberOfRoutes += 1
          data.sessionMetadata.hardestRouteClimbed =
            INDOOR_SPORT_GRADES.indexOf(
              data.sessionMetadata.hardestRouteClimbed
            ) < INDOOR_SPORT_GRADES.indexOf(climb.grade)
              ? climb.grade
              : data.sessionMetadata.hardestRouteClimbed
        }
        data.topRope.push({
          climbType: climb.climbType,
          grade: climb.grade,
          tick: climb.tick,
          count: climb.climbType === "Attempt" ? climb.attemptCount : 1,
          unixTime: climb.unixTime,
        })
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
    }
  })

  return data
}
