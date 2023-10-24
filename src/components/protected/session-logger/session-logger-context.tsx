import React, {
  createContext,
  ReactNode,
  useReducer,
  useMemo,
  useContext,
} from "react"
import { EditSessionClimb, SessionClimb } from "../../../static/types"
import { Moment } from "moment"
import { assembleUserSessionData } from "../../../util/data-helper-functions"
import { logClimbingSession } from "../../../util/db"
import { GYM_CLIMB_TYPES } from "../../../static/constants"

type State = {
  sessionStart: Moment
  boulderData: SessionClimb[]
  routeData: SessionClimb[]
  openAddClimbDialog: boolean
  addClimbType: number
  openEditClimbDialog: boolean
  editClimb: EditSessionClimb
  deleteClimbDialogVisible: boolean
  climbToDelete: { climb: SessionClimb; index: number }
}

type API = {
  onSessionStart: (time: Moment) => void
  onClimbAdded: (climbType: number, climb: SessionClimb) => void
  onOpenAddClimbDialog: (climbType: number) => void
  onCloseAddClimbDialog: () => void
  onOpenEditClimbDialog: (climb: EditSessionClimb) => void
  onCloseEditClimbDialog: () => void
  onUpdateClimb: (climb: EditSessionClimb) => void
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
  false as State["openAddClimbDialog"]
)
const AddClimbTypeContext = createContext<State["addClimbType"]>(
  {} as State["addClimbType"]
)
const OpenEditClimbDialogContext = createContext<State["openEditClimbDialog"]>(
  false as State["openEditClimbDialog"]
)
const EditClimbContext = createContext<State["editClimb"]>(
  {} as State["editClimb"]
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
  | { type: "openAddClimbDialog"; climbType: number }
  | { type: "closeAddClimbDialog" }
  | { type: "openEditClimbDialog"; climb: EditSessionClimb }
  | { type: "closeEditClimbDialog" }
  | { type: "updateClimb"; climb: EditSessionClimb }
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
        openAddClimbDialog: true,
        addClimbType: action.climbType,
      }
    case "closeAddClimbDialog":
      return { ...state, openAddClimbDialog: false }
    case "openEditClimbDialog":
      return { ...state, openEditClimbDialog: true, editClimb: action.climb }
    case "closeEditClimbDialog":
      return {
        ...state,
        openEditClimbDialog: false,
        editClimb: {} as EditSessionClimb,
      }
    case "updateClimb":
      if (action.climb.climbType === GYM_CLIMB_TYPES[0]) {
        state.boulderData[action.climb.index] = action.climb as SessionClimb
        return {
          ...state,
          boulderData: [...state.boulderData],
          openEditClimbDialog: false,
          editClimb: {} as EditSessionClimb,
        }
      }
      state.routeData[action.climb.index] = action.climb as SessionClimb
      return {
        ...state,
        routeData: [...state.routeData],
        openEditClimbDialog: false,
        editClimb: {} as EditSessionClimb,
      }
    case "changeDeleteClimbDialogVisibility":
      return {
        ...state,
        deleteClimbDialogVisible: action.open,
        climbToDelete: { climb: action.climb, index: action.index },
      }
    case "removeClimb":
      if (action.climbType === 0) {
        state.boulderData.splice(action.index, 1)
        return {
          ...state,
          boulderData: [...state.boulderData],
          deleteClimbDialogVisible: false,
          climbToDelete: { climb: {} as SessionClimb, index: -1 },
        }
      }
      state.routeData.splice(action.index, 1)
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
      dispatch({ type: "openAddClimbDialog", climbType })
    }

    const onCloseAddClimbDialog = () => {
      dispatch({ type: "closeAddClimbDialog" })
    }

    const onOpenEditClimbDialog = (climb: EditSessionClimb) => {
      dispatch({ type: "openEditClimbDialog", climb })
    }

    const onCloseEditClimbDialog = () => {
      dispatch({ type: "closeEditClimbDialog" })
    }

    const onUpdateClimb = (climb: EditSessionClimb) => {
      dispatch({ type: "updateClimb", climb })
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
      logClimbingSession(data, userId)
    }

    return {
      onSessionStart,
      onClimbAdded,
      onOpenAddClimbDialog,
      onCloseAddClimbDialog,
      onOpenEditClimbDialog,
      onCloseEditClimbDialog,
      onUpdateClimb,
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
                <OpenEditClimbDialogContext.Provider
                  value={state.openEditClimbDialog}
                >
                  <EditClimbContext.Provider value={state.editClimb}>
                    <DeleteClimbDialogVisibilityContext.Provider
                      value={state.deleteClimbDialogVisible}
                    >
                      <ClimbToDeleteContext.Provider
                        value={state.climbToDelete}
                      >
                        {children}
                      </ClimbToDeleteContext.Provider>
                    </DeleteClimbDialogVisibilityContext.Provider>
                  </EditClimbContext.Provider>
                </OpenEditClimbDialogContext.Provider>
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
export const useOpenEditClimbDialogContext = () =>
  useContext(OpenEditClimbDialogContext)
export const useEditClimbContext = () => useContext(EditClimbContext)
export const useDeleteClimbDialogVisibilityContext = () =>
  useContext(DeleteClimbDialogVisibilityContext)
export const useClimbToDeleteContext = () => useContext(ClimbToDeleteContext)
