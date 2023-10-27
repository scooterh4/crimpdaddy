import React, { createContext, useContext, useMemo, useState } from "react"
import {
  ClimbLog,
  SessionStorageData,
  GradePyramidGraphData,
  UserIndoorRedpointGradesDoc,
} from "../../static/types"
import {
  getAllUserClimbingData,
  updateUserIndoorRedpointGrades,
} from "../../util/db"
import {
  DateFilters,
  GYM_CLIMB_TYPES,
  GradePyramidFilter,
} from "../../static/constants"
import {
  assembleGradePyramidGraphData,
  findNewRedpointGrades,
} from "../../util/data-helper-functions"
import { trackPromise } from "react-promise-tracker"
import { useAuthContext } from "../app/auth-context"

interface IUserContext {
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
  updateSessionStorageData: (logsToAdd: ClimbLog[]) => void
  dataDateRange: number | null
  updateDateRange: (newRange: number | null, fromComponent: string) => void
  userIndoorRedpointGrades: UserIndoorRedpointGradesDoc | null
}

const userDefaultState: IUserContext = {
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
  updateSessionStorageData: () => {},
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
  const { user } = useAuthContext()
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

  // We want this to happen once when the user initially logs in
  useMemo(() => {
    if (user && userClimbingLogs === null && sessionData === null) {
      getAllUserClimbingData(user.id, DateFilters.ThisWeek).then((res) => {
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
      })
    } else {
      if (sessionData !== null) {
        console.log("user context getting persistent data")
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
      }
    }
  }, [user])

  const updateSessionStorageData = (logsToAdd: ClimbLog[]) => {
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

    let newBoulderLogs = userBoulderLogs
    let newLeadLogs = userLeadLogs
    let newTopRopeLogs = userTopRopeLogs

    logsToAdd.forEach((climb) => {
      switch (climb.climbType) {
        case "Boulder":
          newBoulderLogs = newBoulderLogs
            ? newBoulderLogs.concat(climb)
            : [climb]
          break
        case "Lead":
          newLeadLogs = newLeadLogs ? newLeadLogs.concat(climb) : [climb]
          break
        case "TopRope":
          newTopRopeLogs = newTopRopeLogs
            ? newTopRopeLogs.concat(climb)
            : [climb]
          break
      }
    })

    if (newBoulderLogs) {
      setUserBoulderLogs(newBoulderLogs)
      const newBoulderData = assembleGradePyramidGraphData(
        newBoulderLogs,
        GYM_CLIMB_TYPES.Boulder,
        GradePyramidFilter.ClimbsAndAttempts,
        dataDateRange ? dataDateRange : DateFilters.ThisWeek
      )
      setUserBoulderGradePyramidData(newBoulderData)
    }
    if (newLeadLogs) {
      setUserLeadLogs(newLeadLogs)
      const newLeadData = assembleGradePyramidGraphData(
        newLeadLogs,
        GYM_CLIMB_TYPES.Lead,
        GradePyramidFilter.ClimbsAndAttempts,
        dataDateRange ? dataDateRange : DateFilters.ThisWeek
      )
      setUserLeadGradePyramidData(newLeadData)
    }
    if (newTopRopeLogs) {
      setUserTopRopeLogs(newTopRopeLogs)
      const newTrData = assembleGradePyramidGraphData(
        newTopRopeLogs,
        GYM_CLIMB_TYPES.TopRope,
        GradePyramidFilter.ClimbsAndAttempts,
        dataDateRange ? dataDateRange : DateFilters.ThisWeek
      )
      setUserTrGradePyramidData(newTrData)
    }

    sessionStorage.setItem(
      sessionDataKey,
      JSON.stringify({
        timeRange: DateFilters[dataDateRange ? dataDateRange : 0],
        climbingData: {
          allClimbs: userClimbingLogs
            ? userClimbingLogs.concat(logsToAdd)
            : logsToAdd,
          boulderLogs: newBoulderLogs ? newBoulderLogs : [],
          leadLogs: newLeadLogs ? newLeadLogs : [],
          topRopeLogs: newTopRopeLogs ? newTopRopeLogs : [],
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
    updateSessionStorageData,
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
