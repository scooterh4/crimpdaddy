import { Timestamp } from "firebase/firestore"

export type AppUser = {
  id: string
  email: string
}

export type ClimbLog = {
  UserId: string
  ClimbType: string
  Grade: string
  Tick: string
  Attempts: number
  DateTime: Timestamp
}

export type MonthlyClimbData = {
  month: string
  numberOfClimbs: number
}

export type TickTypes = {
  Onsight: number
  Flash: number
  Redpoint: number
  Attempts: number
}

export type ClimbGraphData = {
  Grade: string
  Onsight: number
  Flash: number
  Redpoint: number
  Attempts: number
}
