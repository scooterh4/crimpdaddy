import { Timestamp } from "firebase/firestore"

export type AppUser = {
  id: string
  email: string
}

export type UserClimbingData = {
  climbingLogs: {
    allClimbs: ClimbLog[]
    boulderLogs: ClimbLog[]
    leadLogs: ClimbLog[]
    topRopeLogs: ClimbLog[]
  }
  gradePyramidData: {
    boulderData: ClimbGraphData[]
    leadData: ClimbGraphData[]
    trData: ClimbGraphData[]
  }
  summaryStats: {
    indoorRedpointGrades: UserIndoorRedpointGradesDoc
  }
}

// export type ClimbLogDocument = {
//   climbType: string
//   grade: string
//   tick: string
//   count: number
//   timestamp: Timestamp
// }

export type ClimbLog = {
  climbType: string
  grade: string
  tick: string
  count: number
  unixTime: number
}

export type TickTypes = {
  onsight: number
  flash: number
  redpoint: number
  attempts: number
}

export type GradePyramidGraphData = {
  grade: string
  onsight: number
  flash: number
  redpoint: number
  attempts: number
}

export type SessionStorageData = {
  timeRange: string
  climbingData: {
    allClimbs: ClimbLog[]
    boulderLogs: ClimbLog[]
    leadLogs: ClimbLog[]
    topRopeLogs: ClimbLog[]
  }
  gradePyramidData: {
    boulderData: ClimbGraphData[]
    leadData: ClimbGraphData[]
    trData: ClimbGraphData[]
  }
  summaryStats: {
    indoorRedpointGrades: UserIndoorRedpointGradesDoc
  }
}

export type UserIndoorRedpointGradesDoc = {
  boulder: string
  lead: string
  topRope: string
}

export type SessionClimb = {
  climbType: string
  grade: string
  tick: string
  attemptCount: number
  unixTime: number
}

export type EditSessionClimb = {
  index: number
  climbType: string
  grade: string
  tick: string
  attemptCount: number
  unixTime: number
}

export type ClimbingSessionMetadata = {
  hardestBoulderClimbed: string
  hardestRouteClimbed: string
  numberOfBoulders: number
  numberOfRoutes: number
  sessionStart: Timestamp
}

export type ClimbingSessionData = {
  sessionMetadata: ClimbingSessionMetaData
  climbs: ClimbLog[]
}
