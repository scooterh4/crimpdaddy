import React, {
  createContext,
  ReactNode,
  useReducer,
  useMemo,
  useContext,
} from "react"
import { ClimbLog } from "../../../static/types"

type State = {
  boulderData: ClimbLog[]
  routeData: ClimbLog[]
  openAddClimbDialog: boolean
  addClimbType: number
}

type API = {
  onClimbAdded: (climbType: number, climb: ClimbLog) => void
  onOpenAddClimbDialog: (climbType: number) => void
  // onChangeAddClimbType: (climbType: number) => void
  onCloseAddClimbDialog: () => void
  onSave: () => void
}

const BoulderDataContext = createContext<State["boulderData"]>(
  {} as State["boulderData"]
)
const RouteDataContext = createContext<State["routeData"]>(
  {} as State["routeData"]
)
const OpenAddClimbDialogContext = createContext<State["openAddClimbDialog"]>(
  {} as State["openAddClimbDialog"]
)
const AddClimbTypeContext = createContext<State["addClimbType"]>(
  {} as State["addClimbType"]
)
const APIContext = createContext<API>({} as API)

type Actions =
  | { type: "updateClimbData"; climbType: number; climb: ClimbLog }
  | { type: "openAddClimbDialog"; open: boolean; climbType: number }
  | { type: "closeAddClimbDialog"; open: boolean }

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case "updateClimbData":
      return action.climbType === 0
        ? {
            ...state,
            boulderData: state.boulderData
              ? [...state.boulderData, action.climb]
              : [action.climb],
          }
        : {
            ...state,
            routeData: state.routeData
              ? [...state.routeData, action.climb]
              : [action.climb],
          }
    case "openAddClimbDialog":
      return {
        ...state,
        openAddClimbDialog: action.open,
        addClimbType: action.climbType,
      }
    case "closeAddClimbDialog":
      return { ...state, openAddClimbDialog: action.open }
  }
}

export const SessionLoggerProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [state, dispatch] = useReducer(reducer, {} as State)

  const api = useMemo(() => {
    const onClimbAdded = (climbType: number, climb: ClimbLog) => {
      dispatch({ type: "updateClimbData", climbType, climb })
    }

    const onOpenAddClimbDialog = (climbType: number) => {
      dispatch({ type: "openAddClimbDialog", open: true, climbType })
      // setAddClimbType(climbType)
      // setAddClimbDialog(true)
    }

    const onCloseAddClimbDialog = () => {
      dispatch({ type: "closeAddClimbDialog", open: false })
    }

    // const onCancelAddClimb = () => {
    //   dispatch({ type: "updateOpenAddClimbDialog", false })
    //   // setAddClimbDialog(false)
    // }

    const onSave = () => {
      // send the request to the backend here
    }

    return { onClimbAdded, onOpenAddClimbDialog, onCloseAddClimbDialog, onSave }
  }, [])

  return (
    <APIContext.Provider value={api}>
      <BoulderDataContext.Provider value={state.boulderData}>
        <RouteDataContext.Provider value={state.routeData}>
          <OpenAddClimbDialogContext.Provider value={state.openAddClimbDialog}>
            <AddClimbTypeContext.Provider value={state.addClimbType}>
              {children}
            </AddClimbTypeContext.Provider>
          </OpenAddClimbDialogContext.Provider>
        </RouteDataContext.Provider>
      </BoulderDataContext.Provider>
    </APIContext.Provider>
  )
}

export const useSessionAPI = () => useContext(APIContext)
export const useBoulderData = () => useContext(BoulderDataContext)
export const useRouteData = () => useContext(RouteDataContext)
export const useOpenAddClimbDialog = () => useContext(OpenAddClimbDialogContext)
export const useAddClimbTypeContext = () => useContext(AddClimbTypeContext)
