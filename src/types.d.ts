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

export type ClimbLogDocument = {
  Grade: string
  Tick: string
  Count: number
  Timestamp: Timestamp
}

export type ClimbLog = {
  ClimbType: string
  Grade: string
  Tick: string
  Count: number
  UnixTime: number
}

export type TickTypes = {
  Onsight: number
  Flash: number
  Redpoint: number
  Attempts: number
}

export type GradePyramidGraphData = {
  Grade: string
  Onsight: number
  Flash: number
  Redpoint: number
  Attempts: number
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
  Boulder: string
  Lead: string
  TopRope: string
}
