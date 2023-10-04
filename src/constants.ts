export enum CLIMB_TYPES {
  Boulder,
  Sport,
  Trad,
}

export enum GYM_CLIMB_TYPES {
  Boulder,
  Lead,
  TopRope,
}

export const TICK_TYPES = ["Onsight", "Flash", "Redpoint", "Repeat", "Attempt"]

export const BOULDER_GRADES = [
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
  "V11",
  "V12",
]

export const INDOOR_SPORT_GRADES = [
  "5.6",
  "5.7",
  "5.8",
  "5.9",
  "5.10-",
  "5.10",
  "5.10+",
  "5.11-",
  "5.11",
  "5.11+",
  "5.12-",
  "5.12",
  "5.12+",
  "5.13-",
  "5.13",
  "5.13+",
  "5.14-",
  "5.14",
  "5.14+",
  "5.15-",
  "5.15",
]

export enum DateFilters {
  ThisWeek,
  ThisMonth,
  LastMonth,
  ThisYear,
  Last6Months,
  Last12Months,
}

export enum GradePyramidFilter {
  ClimbsAndAttempts,
  AttemptsOnly,
  ClimbsOnly,
}

export enum PromiseTrackerArea {
  Activity = "activity",
  GradePyramids = "gradePyramids",
  GradePyramidGraph = "gradePyramidGraph",
  Progression = "progression",
  ProgressionGraph = "progressionGraph",
}
