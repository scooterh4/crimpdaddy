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
          setUserClimbingLogs(res.climbingLogs)
          setDateRange(DateFilters.ThisWeek)
          updateGradePyramidData(
            res.gradePyramidData.boulderData,
            res.gradePyramidData.leadData,
            res.gradePyramidData.trData
          )

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
          setUserClimbingLogs(persistentData.climbingData)
          const persistentRange = Object.values(DateFilters).indexOf(
            persistentData.timeRange
          )
          setDateRange(persistentRange)
          updateGradePyramidData(
            persistentData.gradePyramidData.boulderData,
            persistentData.gradePyramidData.leadData,
            persistentData.gradePyramidData.trData
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

    updateGradePyramidDataFromLogs(
      userClimbingLogs ? userClimbingLogs.concat(logsToAdd) : logsToAdd
    )

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
        setUserClimbingLogs(res.climbingLogs)
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

  const updateGradePyramidData = (
    boulderData: ClimbGraphData[],
    leadData: ClimbGraphData[],
    trData: ClimbGraphData[]
  ) => {
    setUserBoulderGradePyramidData(boulderData)
    setUserLeadGradePyramidData(leadData)
    setUserTrGradePyramidData(trData)
  }

  // private function in the context
  function updateGradePyramidDataFromLogs(userClimbingLogs: ClimbLog[]) {
    console.log("updateGradePyramidData in context")
    let boulderingLogs: ClimbLog[] = []
    let leadLogs: ClimbLog[] = []
    let trLogs: ClimbLog[] = []

    userClimbingLogs.forEach((log) => {
      switch (log.ClimbType) {
        case GYM_CLIMB_TYPES[0]:
          boulderingLogs.push(log)
          break
        case GYM_CLIMB_TYPES[1]:
          leadLogs.push(log)
          break
        case GYM_CLIMB_TYPES[2]:
          trLogs.push(log)
          break
      }
    })

    const newBoulderData = formatClimbingData(
      boulderingLogs,
      GYM_CLIMB_TYPES.Boulder
    )
    const newLeadData = formatClimbingData(leadLogs, GYM_CLIMB_TYPES.Lead)
    const newTrData = formatClimbingData(trLogs, GYM_CLIMB_TYPES.TopRope)

    updateGradePyramidData(newBoulderData, newLeadData, newTrData)
  }

  const authUserContextValue: IUserContext = {
    user,
    updateUser,
    userClimbingLogs,
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
