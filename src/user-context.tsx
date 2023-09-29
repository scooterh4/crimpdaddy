import React, { createContext, useContext, useState } from "react"
import {
  AppUser,
  ClimbLog,
  SessionStorageData,
  GradePyramidGraphData,
  UserIndoorRedpointGradesDoc,
} from "./types"
import {
  getAllUserClimbingData,
  updateUserIndoorRedpointGrades,
} from "./util/db"
import { DateFilters, GYM_CLIMB_TYPES, GradePyramidFilter } from "./constants"
import {
  assembleGradePyramidGraphData,
  findNewRedpointGrades,
} from "./util/data-helper-functions"
import { trackPromise } from "react-promise-tracker"

interface IUserContext {
  user: AppUser | null
  updateUser: (newUser: AppUser | null) => void
  userClimbingLogs: ClimbLog[] | null
  userBoulderLogs: ClimbLog[] | null
  setUserBoulderLogs: (logs: ClimbLog[] | null) => void
  userLeadLogs: ClimbLog[] | null
  setUserLeadLogs: (logs: ClimbLog[] | null) => void
  userTopRopeLogs: ClimbLog[] | null
  setUserTopRopeLogs: (logs: ClimbLog[] | null) => void
  userBoulderGradePyramidData: GradePyramidGraphData[] | null
  userLeadGradePyramidData: GradePyramidGraphData[] | null
  userTrGradePyramidData: GradePyramidGraphData[] | null
  clearAppData: () => void
  addClimbLogData: (logsToAdd: ClimbLog[]) => void
  dataDateRange: number | null
  updateDateRange: (newRange: number | null, fromComponent: string) => void
  userIndoorRedpointGrades: UserIndoorRedpointGradesDoc | null
}

const userDefaultState: IUserContext = {
  user: null,
  updateUser: () => {},
  userClimbingLogs: null,
  userBoulderLogs: null,
  setUserBoulderLogs: () => {},
  userLeadLogs: null,
  setUserLeadLogs: () => {},
  userTopRopeLogs: null,
  setUserTopRopeLogs: () => {},
  userBoulderGradePyramidData: null,
  userLeadGradePyramidData: null,
  userTrGradePyramidData: null,
  clearAppData: () => {},
  addClimbLogData: () => {},
  dataDateRange: null,
  updateDateRange: () => {},
  userIndoorRedpointGrades: null,
}

export const UserContext = createContext<IUserContext>(userDefaultState)

const sessionDataKey = "climbingData"

export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [userClimbingLogs, setUserClimbingLogs] = useState<ClimbLog[] | null>(
    null
  )
  const [userBoulderLogs, setUserBoulderLogs] = useState<ClimbLog[] | null>(
    null
  )
  const [userLeadLogs, setUserLeadLogs] = useState<ClimbLog[] | null>(null)
  const [userTopRopeLogs, setUserTopRopeLogs] = useState<ClimbLog[] | null>(
    null
  )
  const [
    userBoulderGradePyramidData,
    setUserBoulderGradePyramidData,
  ] = useState<GradePyramidGraphData[] | null>(null)
  const [userLeadGradePyramidData, setUserLeadGradePyramidData] = useState<
    GradePyramidGraphData[] | null
  >(null)
  const [userTrGradePyramidData, setUserTrGradePyramidData] = useState<
    GradePyramidGraphData[] | null
  >(null)
  const [dataDateRange, setDateRange] = useState<number | null>(null)
  const [
    userIndoorRedpointGrades,
    setUserIndoorRedpointGrades,
  ] = useState<UserIndoorRedpointGradesDoc | null>(null)
  const sessionData = sessionStorage.getItem(sessionDataKey)

  const updateUser = (saveUser: AppUser | null) => {
    setUser(saveUser)
    if (saveUser !== null) {
      if (userClimbingLogs === null && sessionData === null) {
        // We want this to happen once when the user initially logs in
        getAllUserClimbingData(saveUser.id, DateFilters.ThisWeek).then(
          (res) => {
            setUserClimbingLogs(res.climbingLogs.allClimbs)
            setUserBoulderLogs(res.climbingLogs.boulderLogs)
            setUserLeadLogs(res.climbingLogs.leadLogs)
            setUserTopRopeLogs(res.climbingLogs.topRopeLogs)
            setDateRange(DateFilters.ThisWeek)
            setUserBoulderGradePyramidData(res.gradePyramidData.boulderData)
            setUserLeadGradePyramidData(res.gradePyramidData.leadData)
            setUserTrGradePyramidData(res.gradePyramidData.trData)
            setUserIndoorRedpointGrades(res.summaryStats.indoorRedpointGrades)

            sessionStorage.setItem(
              sessionDataKey,
              JSON.stringify({
                timeRange: DateFilters[DateFilters.ThisWeek],
                climbingData: res.climbingLogs,
                gradePyramidData: res.gradePyramidData,
                summaryStats: res.summaryStats,
              })
            )
          }
        )
      } else {
        if (sessionData !== null) {
          const persistentData: SessionStorageData = JSON.parse(sessionData)
          setUserClimbingLogs(persistentData.climbingData.allClimbs)
          setUserBoulderLogs(persistentData.climbingData.boulderLogs)
          setUserLeadLogs(persistentData.climbingData.leadLogs)
          setUserTopRopeLogs(persistentData.climbingData.topRopeLogs)
          const persistentRange = Object.values(DateFilters).indexOf(
            persistentData.timeRange
          )
          setDateRange(persistentRange)
          setUserBoulderGradePyramidData(
            persistentData.gradePyramidData.boulderData
          )
          setUserLeadGradePyramidData(persistentData.gradePyramidData.leadData)
          setUserTrGradePyramidData(persistentData.gradePyramidData.trData)
          setUserIndoorRedpointGrades(
            persistentData.summaryStats.indoorRedpointGrades
          )
        } else {
          console.log(
            "WARNING!",
            "Odd case where sessionData is null and climbingData is not null"
          )
        }
      }
    }
  }

  // used when logging out
  const clearAppData = () => {
    setUserClimbingLogs(null)
    setUserBoulderLogs(null)
    setUserLeadLogs(null)
    setUserTopRopeLogs(null)
    setUserBoulderGradePyramidData(null)
    setUserLeadGradePyramidData(null)
    setUserTrGradePyramidData(null)
    setUserIndoorRedpointGrades(null)
    sessionStorage.removeItem("climbingData")
  }

  // used when logging a climb. Adds the doc to the climbing data instead of calling firestore again
  const addClimbLogData = (logsToAdd: ClimbLog[]) => {
    let boulderLogsReturn: ClimbLog[] | null = null
    let leadLogsReturn: ClimbLog[] | null = null
    let topRopeLogsReturn: ClimbLog[] | null = null

    setUserClimbingLogs(
      userClimbingLogs ? userClimbingLogs.concat(logsToAdd) : logsToAdd
    )

    const redpointGrades = findNewRedpointGrades(
      userIndoorRedpointGrades,
      logsToAdd
    )
    if (user) {
      updateUserIndoorRedpointGrades(user.id, redpointGrades)
    }
    setUserIndoorRedpointGrades(redpointGrades)

    const climbType = logsToAdd[0].ClimbType
    switch (climbType) {
      case "Boulder":
        setUserBoulderLogs(
          userBoulderLogs ? userBoulderLogs.concat(logsToAdd) : logsToAdd
        )
        const newBoulderData = assembleGradePyramidGraphData(
          userBoulderLogs ? userBoulderLogs.concat(logsToAdd) : logsToAdd,
          GYM_CLIMB_TYPES.Boulder,
          GradePyramidFilter.ClimbsAndAttempts,
          dataDateRange ? dataDateRange : DateFilters.ThisWeek
        )
        setUserBoulderGradePyramidData(newBoulderData)
        boulderLogsReturn = userBoulderLogs
          ? userBoulderLogs.concat(logsToAdd)
          : logsToAdd
        break

      case "Lead":
        setUserLeadLogs(
          userLeadLogs ? userLeadLogs.concat(logsToAdd) : logsToAdd
        )
        const newLeadData = assembleGradePyramidGraphData(
          userLeadLogs ? userLeadLogs.concat(logsToAdd) : logsToAdd,
          GYM_CLIMB_TYPES.Lead,
          GradePyramidFilter.ClimbsAndAttempts,
          dataDateRange ? dataDateRange : DateFilters.ThisWeek
        )
        setUserLeadGradePyramidData(newLeadData)
        leadLogsReturn = userLeadLogs
          ? userLeadLogs.concat(logsToAdd)
          : logsToAdd
        break

      case "TopRope":
        setUserTopRopeLogs(
          userTopRopeLogs ? userTopRopeLogs.concat(logsToAdd) : logsToAdd
        )
        const newTrData = assembleGradePyramidGraphData(
          userTopRopeLogs ? userTopRopeLogs.concat(logsToAdd) : logsToAdd,
          GYM_CLIMB_TYPES.TopRope,
          GradePyramidFilter.ClimbsAndAttempts,
          dataDateRange ? dataDateRange : DateFilters.ThisWeek
        )
        setUserTrGradePyramidData(newTrData)
        topRopeLogsReturn = userTopRopeLogs
          ? userTopRopeLogs.concat(logsToAdd)
          : logsToAdd
        break
    }

    sessionStorage.setItem(
      sessionDataKey,
      JSON.stringify({
        timeRange: DateFilters[dataDateRange ? dataDateRange : 0],
        climbingData: {
          allClimbs: userClimbingLogs
            ? userClimbingLogs.concat(logsToAdd)
            : logsToAdd,
          boulderLogs: boulderLogsReturn
            ? boulderLogsReturn
            : userBoulderLogs
            ? userBoulderLogs
            : [],
          leadLogs: leadLogsReturn
            ? leadLogsReturn
            : userLeadLogs
            ? userLeadLogs
            : [],
          topRopeLogs: topRopeLogsReturn
            ? topRopeLogsReturn
            : userTopRopeLogs
            ? userTopRopeLogs
            : [],
        },
        gradePyramidData: {
          boulderData: userBoulderGradePyramidData,
          leadData: userLeadGradePyramidData,
          trData: userTrGradePyramidData,
        },
        summaryStats: {
          indoorRedpointGrades: userIndoorRedpointGrades,
        },
      })
    )
  }

  // after initializing, we want this to be the only place to call firestore
  const updateDateRange = (saveRange: number | null, fromComponent: string) => {
    setDateRange(saveRange)
    if (saveRange && user) {
      trackPromise(
        getAllUserClimbingData(user.id, saveRange).then((res) => {
          setUserClimbingLogs(res.climbingLogs.allClimbs)
          setUserBoulderLogs(res.climbingLogs.boulderLogs)
          setUserLeadLogs(res.climbingLogs.leadLogs)
          setUserTopRopeLogs(res.climbingLogs.topRopeLogs)
          setUserBoulderGradePyramidData(res.gradePyramidData.boulderData)
          setUserLeadGradePyramidData(res.gradePyramidData.leadData)
          setUserTrGradePyramidData(res.gradePyramidData.trData)
          setUserIndoorRedpointGrades(res.summaryStats.indoorRedpointGrades)

          sessionStorage.setItem(
            sessionDataKey,
            JSON.stringify({
              timeRange: DateFilters[saveRange],
              climbingData: res.climbingLogs,
              gradePyramidData: res.gradePyramidData,
              summaryStats: res.summaryStats,
            })
          )
        }),
        fromComponent
      )
    } else {
      console.log(
        "WARNING! UpdateDateRange in context-api doesn't have both a user and a saveRange"
      )
    }
  }

  const authUserContextValue: IUserContext = {
    user,
    updateUser,
    userClimbingLogs,
    userBoulderLogs,
    setUserBoulderLogs,
    userLeadLogs,
    setUserLeadLogs,
    userTopRopeLogs,
    setUserTopRopeLogs,
    userBoulderGradePyramidData,
    userLeadGradePyramidData,
    userTrGradePyramidData,
    clearAppData,
    addClimbLogData,
    dataDateRange,
    updateDateRange,
    userIndoorRedpointGrades,
  }

  return (
    <UserContext.Provider value={authUserContextValue}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)
