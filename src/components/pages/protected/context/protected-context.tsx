import React, { createContext, useContext, useMemo, useReducer } from "react"
import {
  ClimbingDataToAdd,
  UserSessionStorageData,
} from "../../../../static/types"

type State = {
  dataDateRange: string
  dataLastRead: number
  dataUpdated: number | null
  userClimbingData: UserSessionStorageData | null
}

type API = {
  onUpdateDataDateRange: (range: string) => void
  onUpdateDataLastRead: (unixTime: number) => void
  onUpdateDataUpdated: (unixTime: number) => void
  onAddUserClimbingData: (data: ClimbingDataToAdd) => void
  onUpdateUserClimbingData: (
    userClimbingData: UserSessionStorageData | null
  ) => void
}

const DataDateRangeContext = createContext<State["dataDateRange"]>(
  {} as State["dataDateRange"]
)
const DataLastReadContext = createContext<State["dataLastRead"]>(
  {} as State["dataLastRead"]
)
const DataUpdatedContext = createContext<State["dataUpdated"]>(
  {} as State["dataUpdated"]
)
const UserClimbingDataContext = createContext<State["userClimbingData"]>(
  {} as State["userClimbingData"]
)

const APIContext = createContext<API>({} as API)

type Actions =
  | { type: "updateDataDateRange"; range: string }
  | { type: "updateDataLastRead"; unixTime: number }
  | { type: "updateDataUpdated"; unixTime: number }
  | {
      type: "addUserClimbingData"
      data: ClimbingDataToAdd
    }
  | {
      type: "updateUserClimbingData"
      userClimbingData: UserSessionStorageData | null
    }

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case "updateDataDateRange":
      return { ...state, dataDateRange: action.range }

    case "updateDataLastRead":
      return { ...state, dataLastRead: action.unixTime }

    case "updateDataUpdated":
      return { ...state, dataUpdated: action.unixTime }

    case "addUserClimbingData":
      let allClimbs = action.data.climbs
      let boulders = action.data.boulders
      let lead = action.data.lead
      let topRope = action.data.topRope
      let session = [
        {
          sessionMetadata: action.data.sessionMetadata,
          climbs: action.data.climbs,
        },
      ]

      if (state.userClimbingData) {
        allClimbs = allClimbs.concat(state.userClimbingData.allClimbs)
        boulders = boulders.concat(state.userClimbingData.boulderLogs)
        lead = lead.concat(state.userClimbingData.leadLogs)
        topRope = topRope.concat(state.userClimbingData.topRopeLogs)
        session = session.concat(state.userClimbingData.sessions)
      }

      const climbingData: UserSessionStorageData = {
        allClimbs: allClimbs,
        boulderLogs: boulders,
        leadLogs: lead,
        topRopeLogs: topRope,
        sessions: session,
        indoorRedpointGrades: action.data.newRedpointGrades,
      }
      return { ...state, userClimbingData: climbingData }

    case "updateUserClimbingData":
      return { ...state, userClimbingData: action.userClimbingData }
  }
}

export const ProtectedDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [state, dispatch] = useReducer(reducer, {} as State)

  const api = useMemo(() => {
    const onUpdateDataDateRange = (range: string) => {
      dispatch({ type: "updateDataDateRange", range })
    }

    const onUpdateDataLastRead = (unixTime: number) => {
      dispatch({ type: "updateDataLastRead", unixTime })
    }

    const onUpdateDataUpdated = (unixTime: number) => {
      dispatch({ type: "updateDataUpdated", unixTime })
    }

    const onAddUserClimbingData = (data: ClimbingDataToAdd) => {
      dispatch({ type: "addUserClimbingData", data })
    }

    const onUpdateUserClimbingData = (
      userClimbingData: UserSessionStorageData | null
    ) => {
      dispatch({ type: "updateUserClimbingData", userClimbingData })
    }

    return {
      onUpdateDataDateRange,
      onUpdateDataLastRead,
      onUpdateDataUpdated,
      onAddUserClimbingData,
      onUpdateUserClimbingData,
    }
  }, [])

  return (
    <APIContext.Provider value={api}>
      <DataDateRangeContext.Provider value={state.dataDateRange}>
        <DataLastReadContext.Provider value={state.dataLastRead}>
          <DataUpdatedContext.Provider value={state.dataUpdated}>
            <UserClimbingDataContext.Provider value={state.userClimbingData}>
              {children}
            </UserClimbingDataContext.Provider>
          </DataUpdatedContext.Provider>
        </DataLastReadContext.Provider>
      </DataDateRangeContext.Provider>
    </APIContext.Provider>
  )
}

export const useProtectedAPI = () => useContext(APIContext)
export const useDataDateRangeContext = () => useContext(DataDateRangeContext)
export const useDataLastReadContext = () => useContext(DataLastReadContext)
export const useDataUpdatedContext = () => useContext(DataUpdatedContext)
export const useUserClimbingDataContext = () =>
  useContext(UserClimbingDataContext)
