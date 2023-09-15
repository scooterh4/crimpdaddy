import React, { createContext, useContext, useState } from "react"
import {
  AppUser,
  ClimbLog,
  UserClimbingData,
  SessionStorageData,
} from "../static/types"
import { GetAllUserClimbs } from "../db/ClimbLogService"
import { DateFilters, GYM_CLIMB_TYPES } from "../static/constants"

interface IUserContext {
  user: AppUser | null
  updateUser: (newUser: AppUser | null) => void
  userClimbingData: UserClimbingData | null
  clearAppData: () => void
  addClimb: (log: ClimbLog) => void
  dataDateRange: number | null
  updateDateRange: (newRange: number | null) => void
}

const userDefaultState: IUserContext = {
  user: null,
  updateUser: () => {},
  userClimbingData: null,
  clearAppData: () => {},
  addClimb: () => {},
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
  const [userClimbingData, setAppData] = useState<UserClimbingData | null>(null)
  const [dataDateRange, setDateRange] = useState<number | null>(null)
  const sessionData = sessionStorage.getItem(sessionDataKey)

  const updateUser = (saveUser: AppUser | null) => {
    setUser(saveUser)
    if (saveUser !== null) {
      if (userClimbingData === null && sessionData === null) {
        // We want this to happen once when the user initially logs in
        GetAllUserClimbs(saveUser.id, DateFilters.ThisWeek).then((res) => {
          setAppData(res)
          setDateRange(DateFilters.ThisWeek)

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
          setAppData({
            climbingLogs: persistentData.climbingData,
            gradePyramidData: persistentData.gradePyramidData,
          })
          const persistentRange = Object.values(DateFilters).indexOf(
            persistentData.timeRange
          )
          setDateRange(persistentRange)
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
    setAppData(null)
    sessionStorage.removeItem("climbingData")
  }

  // used when logging a climb. Adds the doc to the climbing data instead of calling firestore again
  const addClimb = (log: ClimbLog) => {
    if (userClimbingData) {
      let newLogData = userClimbingData.climbingLogs
      let newGradePyramidData = userClimbingData.gradePyramidData

      newLogData.push(log)

      console.log(
        "Here the gradePyramidData:",
        userClimbingData.gradePyramidData
      )

      setAppData({
        climbingLogs: newLogData,
        gradePyramidData: newGradePyramidData,
      })
    } else {
    }
  }

  // after initializing, we want this to be the only place to call firestore
  const updateDateRange = (saveRange: number | null) => {
    setDateRange(saveRange)
    if (saveRange && user) {
      GetAllUserClimbs(user.id, saveRange).then((res) => {
        setAppData(res)

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
    userClimbingData,
    clearAppData,
    addClimb,
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
