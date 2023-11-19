import { Timestamp } from "firebase/firestore"

export type AppUser = {
  id: string
  email: string
}

export type UserSessionStorageData = {
  sessions: ClimbingSessionData[]
  allClimbs: ClimbLog[]
  boulderLogs: ClimbLog[]
  leadLogs: ClimbLog[]
  topRopeLogs: ClimbLog[]
  indoorRedpointGrades: UserIndoorRedpointGradesDoc
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

export interface TickTypes {
  flash: number
  attempts: number
  repeats: number
}

export interface BoulderTickTypes extends TickTypes {
  sends: number
}

export interface RouteTickTypes extends TickTypes {
  onsight: number
  redpoint: number
}

interface GradePyramidGraphData {
  grade: string
  flash: number
  attempts: number
}

export interface RouteGradePyramidGraphData extends GradePyramidGraphData {
  onsight: number
  redpoint: number
}

export interface BoulderGradePyramidGraphData extends GradePyramidGraphData {
  sends: number
}

export type ProgressionGraphData = {
  monthIdx: number
  month: string
  hardestClimbIdx: number
  hardestAttemptIdx: number
  progressionLine: number
}

export type SessionStorageData = {
  timeRange: string
  climbingData: {
    allClimbs: ClimbLog[]
    boulderLogs: ClimbLog[]
    leadLogs: ClimbLog[]
    topRopeLogs: ClimbLog[]
    sessions: ClimbingSessionData[]
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
  sessionId: string
  hardestBoulderClimbed: string
  hardestRouteClimbed: string
  numberOfBoulders: number
  numberOfRoutes: number
  failedAttempts: number
  sessionStart: Timestamp
  sessionEnd: Timestamp
}

export type ClimbingSessionData = {
  sessionMetadata: ClimbingSessionMetaData
  climbs: ClimbLog[]
}
