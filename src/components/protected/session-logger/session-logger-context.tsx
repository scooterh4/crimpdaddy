import React, {
  createContext,
  ReactNode,
  useReducer,
  useMemo,
  useContext,
} from "react"
import { SessionClimb } from "../../../static/types"
import { Moment } from "moment"
import { assembleUserSessionData } from "../../../util/data-helper-functions"
import { logClimbingSession } from "../../../util/db"

type State = {
  sessionStart: Moment
  boulderData: SessionClimb[]
  routeData: SessionClimb[]
  openAddClimbDialog: boolean
  addClimbType: number
  deleteClimbDialogVisible: boolean
  climbToDelete: { climb: SessionClimb; index: number }
}

type API = {
  onSessionStart: (time: Moment) => void
  onClimbAdded: (climbType: number, climb: SessionClimb) => void
  onOpenAddClimbDialog: (climbType: number) => void
  onCloseAddClimbDialog: () => void
  onOpenDeleteClimbDialog: (climb: SessionClimb, index: number) => void
  onCloseDeleteClimbDialog: () => void
  onRemoveClimb: (climbType: number, index: number) => void
  onLogSession: (
    sessionStart: Moment,
    climbs: SessionClimb[],
    userId: string
  ) => void
}

const SessionStartContext = createContext<State["sessionStart"]>(
  {} as State["sessionStart"]
)
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
const DeleteClimbDialogVisibilityContext = createContext<
  State["deleteClimbDialogVisible"]
>({} as State["deleteClimbDialogVisible"])
const ClimbToDeleteContext = createContext<State["climbToDelete"]>(
  {} as State["climbToDelete"]
)

const APIContext = createContext<API>({} as API)

type Actions =
  | { type: "sessionStarted"; time: Moment }
  | { type: "addClimbData"; climbType: number; climb: SessionClimb }
  | { type: "openAddClimbDialog"; open: boolean; climbType: number }
  | { type: "closeAddClimbDialog"; open: boolean }
  | {
      type: "changeDeleteClimbDialogVisibility"
      open: boolean
      climb: SessionClimb
      index: number
    }
  | { type: "removeClimb"; climbType: number; index: number }

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case "sessionStarted":
      return { ...state, sessionStart: action.time }
    case "addClimbData":
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
    case "changeDeleteClimbDialogVisibility":
      return {
        ...state,
        deleteClimbDialogVisible: action.open,
        climbToDelete: { climb: action.climb, index: action.index },
      }
    case "removeClimb":
      console.log("context action", action)
      if (action.climbType === 0) {
        state.boulderData.splice(action.index, 1)
        console.log("remaining boulders", [...state.boulderData])
        return {
          ...state,
          boulderData: [...state.boulderData],
          deleteClimbDialogVisible: false,
          climbToDelete: { climb: {} as SessionClimb, index: -1 },
        }
      }
      state.routeData.splice(action.index, 1)
      console.log("remaining routes", [...state.routeData])
      return {
        ...state,
        routeData: [...state.routeData],
        deleteClimbDialogVisible: false,
        climbToDelete: { climb: {} as SessionClimb, index: -1 },
      }
  }
}

export const SessionLoggerProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [state, dispatch] = useReducer(reducer, {} as State)

  const api = useMemo(() => {
    const onSessionStart = (time: Moment) => {
      dispatch({ type: "sessionStarted", time })
    }

    const onClimbAdded = (climbType: number, climb: SessionClimb) => {
      dispatch({ type: "addClimbData", climbType, climb })
    }

    const onOpenAddClimbDialog = (climbType: number) => {
      dispatch({ type: "openAddClimbDialog", open: true, climbType })
    }

    const onCloseAddClimbDialog = () => {
      dispatch({ type: "closeAddClimbDialog", open: false })
    }

    const onOpenDeleteClimbDialog = (climb: SessionClimb, index: number) => {
      dispatch({
        type: "changeDeleteClimbDialogVisibility",
        open: true,
        climb,
        index,
      })
    }

    const onCloseDeleteClimbDialog = () => {
      dispatch({
        type: "changeDeleteClimbDialogVisibility",
        open: false,
        climb: {} as SessionClimb,
        index: -1,
      })
    }

    const onRemoveClimb = (climbType: number, index: number) => {
      dispatch({ type: "removeClimb", climbType, index })
    }

    const onLogSession = (
      sessionStart: Moment,
      climbs: SessionClimb[],
      userId: string
    ) => {
      const data = assembleUserSessionData(sessionStart, climbs)
      console.log("heres the assembled data", data)
      //logClimbingSession(data, userId)
    }

    return {
      onSessionStart,
      onClimbAdded,
      onOpenAddClimbDialog,
      onCloseAddClimbDialog,
      onOpenDeleteClimbDialog,
      onCloseDeleteClimbDialog,
      onRemoveClimb,
      onLogSession,
    }
  }, [])

  return (
    <APIContext.Provider value={api}>
      <SessionStartContext.Provider value={state.sessionStart}>
        <BoulderDataContext.Provider value={state.boulderData}>
          <RouteDataContext.Provider value={state.routeData}>
            <OpenAddClimbDialogContext.Provider
              value={state.openAddClimbDialog}
            >
              <AddClimbTypeContext.Provider value={state.addClimbType}>
                <DeleteClimbDialogVisibilityContext.Provider
                  value={state.deleteClimbDialogVisible}
                >
                  <ClimbToDeleteContext.Provider value={state.climbToDelete}>
                    {children}
                  </ClimbToDeleteContext.Provider>
                </DeleteClimbDialogVisibilityContext.Provider>
              </AddClimbTypeContext.Provider>
            </OpenAddClimbDialogContext.Provider>
          </RouteDataContext.Provider>
        </BoulderDataContext.Provider>
      </SessionStartContext.Provider>
    </APIContext.Provider>
  )
}

export const useSessionAPI = () => useContext(APIContext)
export const useBoulderData = () => useContext(BoulderDataContext)
export const useRouteData = () => useContext(RouteDataContext)
export const useOpenAddClimbDialog = () => useContext(OpenAddClimbDialogContext)
export const useAddClimbTypeContext = () => useContext(AddClimbTypeContext)
export const useDeleteClimbDialogVisibilityContext = () =>
  useContext(DeleteClimbDialogVisibilityContext)
export const useClimbToDeleteContext = () => useContext(ClimbToDeleteContext)
