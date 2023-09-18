import React, { createContext, useContext, useState } from "react"
import {
  AppUser,
  ClimbLog,
  SessionStorageData,
  ClimbGraphData,
} from "../static/types"
import { GetAllUserClimbs, formatClimbingData } from "../db/ClimbLogService"
import { DateFilters, GYM_CLIMB_TYPES } from "../static/constants"

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
  userBoulderGradePyramidData: ClimbGraphData[] | null
  userLeadGradePyramidData: ClimbGraphData[] | null
  userTrGradePyramidData: ClimbGraphData[] | null
  clearAppData: () => void
  addClimbLogData: (logsToAdd: ClimbLog[]) => void
  dataDateRange: number | null
  updateDateRange: (newRange: number | null) => void
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
  ] = useState<ClimbGraphData[] | null>(null)
  const [userLeadGradePyramidData, setUserLeadGradePyramidData] = useState<
    ClimbGraphData[] | null
  >(null)
  const [userTrGradePyramidData, setUserTrGradePyramidData] = useState<
    ClimbGraphData[] | null
  >(null)
  const [dataDateRange, setDateRange] = useState<number | null>(null)
  const sessionData = sessionStorage.getItem(sessionDataKey)

  const updateUser = (saveUser: AppUser | null) => {
    setUser(saveUser)
    if (saveUser !== null) {
      if (userClimbingLogs === null && sessionData === null) {
        // We want this to happen once when the user initially logs in
        GetAllUserClimbs(saveUser.id, DateFilters.ThisWeek).then((res) => {
          setUserClimbingLogs(res.climbingLogs.allClimbs)
          setUserBoulderLogs(res.climbingLogs.boulderLogs)
          setUserLeadLogs(res.climbingLogs.leadLogs)
          setUserTopRopeLogs(res.climbingLogs.topRopeLogs)
          setDateRange(DateFilters.ThisWeek)
          setUserBoulderGradePyramidData(res.gradePyramidData.boulderData)
          setUserLeadGradePyramidData(res.gradePyramidData.leadData)
          setUserTrGradePyramidData(res.gradePyramidData.trData)

          sessionStorage.setItem(
            sessionDataKey,
            JSON.stringify({
              timeRange: DateFilters[dataDateRange ? dataDateRange : 0],
              climbingData: res.climbingLogs,
              gradePyramidData: res.gradePyramidData,
            })
          )
        })
      } else {
        if (sessionData !== null) {
          console.log("context getting sessionData")
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
    sessionStorage.removeItem("climbingData")
  }

  // used when logging a climb. Adds the doc to the climbing data instead of calling firestore again
  const addClimbLogData = (logsToAdd: ClimbLog[]) => {
    setUserClimbingLogs(
      userClimbingLogs ? userClimbingLogs.concat(logsToAdd) : logsToAdd
    )

    const climbType = logsToAdd[0].ClimbType
    switch (climbType) {
      case "Boulder":
        setUserBoulderLogs(
          userBoulderLogs ? userBoulderLogs.concat(logsToAdd) : logsToAdd
        )
        const newBoulderData = formatClimbingData(
          userBoulderLogs ? userBoulderLogs.concat(logsToAdd) : logsToAdd,
          GYM_CLIMB_TYPES.Boulder
        )
        setUserBoulderGradePyramidData(newBoulderData)
        break

      case "Lead":
        setUserLeadLogs(
          userLeadLogs ? userLeadLogs.concat(logsToAdd) : logsToAdd
        )
        const newLeadData = formatClimbingData(
          userLeadLogs ? userLeadLogs.concat(logsToAdd) : logsToAdd,
          GYM_CLIMB_TYPES.Lead
        )
        setUserLeadGradePyramidData(newLeadData)
        break

      case "TopRope":
        setUserTopRopeLogs(
          userTopRopeLogs ? userTopRopeLogs.concat(logsToAdd) : logsToAdd
        )
        const newTrData = formatClimbingData(
          userTopRopeLogs ? userTopRopeLogs.concat(logsToAdd) : logsToAdd,
          GYM_CLIMB_TYPES.TopRope
        )
        setUserTrGradePyramidData(newTrData)
        break
    }

    sessionStorage.setItem(
      sessionDataKey,
      JSON.stringify({
        timeRange: DateFilters[dataDateRange ? dataDateRange : 0],
        climbingData: userClimbingLogs
          ? userClimbingLogs.concat(logsToAdd)
          : logsToAdd,
        gradePyramidData: {
          boulderData: userBoulderGradePyramidData,
          leadData: userLeadGradePyramidData,
          trData: userTrGradePyramidData,
        },
      })
    )

    console.log("The context climbing data should be up to date")
  }

  // after initializing, we want this to be the only place to call firestore
  const updateDateRange = (saveRange: number | null) => {
    setDateRange(saveRange)
    if (saveRange && user) {
      GetAllUserClimbs(user.id, saveRange).then((res) => {
        setUserClimbingLogs(res.climbingLogs.allClimbs)
        setUserBoulderLogs(res.climbingLogs.boulderLogs)
        setUserLeadLogs(res.climbingLogs.leadLogs)
        setUserTopRopeLogs(res.climbingLogs.topRopeLogs)
        setUserBoulderGradePyramidData(res.gradePyramidData.boulderData)
        setUserLeadGradePyramidData(res.gradePyramidData.leadData)
        setUserTrGradePyramidData(res.gradePyramidData.trData)

        sessionStorage.setItem(
          sessionDataKey,
          JSON.stringify({
            timeRange: DateFilters[saveRange],
            climbingData: res.climbingLogs,
            gradePyramidData: res.gradePyramidData,
          })
        )
      })
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
  }

  return (
    <UserContext.Provider value={authUserContextValue}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)
