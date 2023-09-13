import React, { createContext, useContext, useState } from "react"
import { AppUser, SessionStorageData } from "../static/types"
import {
  ClimbingData,
  DateFilters,
  GetAllUserClimbs,
} from "../db/ClimbLogService"

interface IUserContext {
  user: AppUser | null
  updateUser: (newUser: AppUser | null) => void
  climbingData: ClimbingData | null
  updateData: (newData: ClimbingData | null) => void
  dataDateRange: number | null
  updateDateRange: (newRange: number | null) => void
}

const userDefaultState: IUserContext = {
  user: null,
  updateUser: () => {},
  climbingData: null,
  updateData: () => {},
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
  const [climbingData, setData] = useState<ClimbingData | null>(null)
  const [dataDateRange, setDateRange] = useState<number | null>(null)
  const sessionData = sessionStorage.getItem(sessionDataKey)

  const updateUser = (saveUser: AppUser | null) => {
    setUser(saveUser)
    if (saveUser !== null) {
      if (climbingData === null && sessionData === null) {
        // We want this to happen once when the user initially logs in
        GetAllUserClimbs(saveUser.id, DateFilters.ThisWeek).then((res) => {
          setData(res)
          setDateRange(DateFilters.ThisWeek)

          sessionStorage.setItem(
            sessionDataKey,
            JSON.stringify({
              timeRange: DateFilters[dataDateRange ? dataDateRange : 0],
              climbingData: res.climbingData,
              gradePyramidData: res.gradePyramidData,
            })
          )
        })
      } else {
        if (sessionData !== null) {
          console.log("context getting sessionData")
          const persistentData: SessionStorageData = JSON.parse(sessionData)
          setData({
            climbingData: persistentData.climbingData,
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

  // this should only be used when logging out
  const updateData = (saveData: ClimbingData | null) => {
    setData(saveData)
    saveData === null
      ? sessionStorage.removeItem("climbingData")
      : sessionStorage.setItem("climbingData", JSON.stringify(saveData))
  }

  // after initializing, we want this to be the only place to call firestore
  const updateDateRange = (saveRange: number | null) => {
    setDateRange(saveRange)
    if (saveRange && user) {
      GetAllUserClimbs(user.id, saveRange).then((res) => {
        setData(res)

        sessionStorage.setItem(
          sessionDataKey,
          JSON.stringify({
            timeRange: DateFilters[saveRange],
            climbingData: res.climbingData,
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
    climbingData,
    updateData,
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

// type State = {
//   user: AppUser | null
//   climbingData: ClimbingData
// }

// type API = {
//   onUserChange: (user: AppUser | null) => void
//   onDataChange: (climbingData: ClimbingData) => void
// }

// export const UserContext = createContext<State["user"]>({} as State["user"])
// export const ClimbingDataContext = createContext<State["climbingData"]>(
//   {} as State["climbingData"]
// )
// const UserAPIContext = createContext<API>({} as API)

// type Actions =
//   | { type: "updateUser"; user: AppUser | null }
//   | { type: "updateData"; climbingData: ClimbingData }

// const reducer = (state: State, action: Actions): State => {
//   switch (action.type) {
//     case "updateUser":
//       return { ...state, user: action.user }
//     case "updateData":
//       return { ...state, climbingData: action.climbingData }
//   }
// }

// export const UserDataProvider = ({ children }: { children: ReactNode }) => {
//   const [state, dispatch] = useReducer(reducer, {} as State)

//   const api = useMemo(() => {
//     const onSave = () => {
//       // send the request to the backend here
//     }

//     const onUserChange = (user: AppUser | null) => {
//       console.log("UserDataProvider updating user:", user)
//       dispatch({ type: "updateUser", user })
//     }

//     const onDataChange = (climbingData: ClimbingData) => {
//       dispatch({ type: "updateData", climbingData })
//     }

//     return { onSave, onUserChange, onDataChange }
//   }, [])

//   return (
//     <UserAPIContext.Provider value={api}>
//       <UserContext.Provider value={state.user}>
//         <ClimbingDataContext.Provider value={state.climbingData}>
//           {children}
//         </ClimbingDataContext.Provider>
//       </UserContext.Provider>
//     </UserAPIContext.Provider>
//   )
// }

// export const useUserAPI = () => useContext(UserAPIContext)
// export const useUserContext = () => useContext(UserContext)
// export const useClimbingDataContext = () => useContext(ClimbingDataContext)
