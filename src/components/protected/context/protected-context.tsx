import React, { createContext, useContext, useMemo, useReducer } from "react"
import {
  ClimbingSessionData,
  UserSessionStorageData,
} from "../../../static/types"

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
  // onAddUserClimbingData: (data: ClimbingSessionData) => void
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
  // | {
  //   type: "addUserClimbingData"
  //   data: ClimbingSessionData
  // }
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
      console.log("onUpdateDataUpdated", unixTime)
      dispatch({ type: "updateDataUpdated", unixTime })
    }

    // const onAddUserClimbingData = (data: ClimbingSessionData) => {
    //   const oldData = state.userClimbingData
    //   const newData = {}
    // }

    const onUpdateUserClimbingData = (
      userClimbingData: UserSessionStorageData | null
    ) => {
      dispatch({ type: "updateUserClimbingData", userClimbingData })
    }

    return {
      onUpdateDataDateRange,
      onUpdateDataLastRead,
      onUpdateDataUpdated,
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
