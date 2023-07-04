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
  DateTime: Date
}

export type ClimbGraphData = {
  Grade: string
  Attempts: number
  Flash: number
}
