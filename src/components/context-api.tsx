import React, { createContext, useState } from "react"
import { AppUser } from "../static/types"
import { ClimbingData } from "../db/ClimbLogService"

interface IUserContext {
  user: AppUser | null
  updateUser: (newUser: AppUser | null) => void
}

const defaultState: IUserContext = {
  user: null,
  updateUser: () => {},
}

export const UserContext = createContext<IUserContext>(defaultState)

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const updateUser = (saveUser: AppUser | null) => {
    setUser(saveUser)
  }

  const authUserContextValue: IUserContext = {
    user,
    updateUser,
  }

  return (
    <UserContext.Provider value={authUserContextValue}>
      {children}
    </UserContext.Provider>
  )
}

interface IClimbingDataContext {
  data: ClimbingData | null
  updateData: (newUser: ClimbingData | null) => void
  dataTimeRange: string
  updateDataTimeRange: (newTimeRange: string) => void
}

const dataDefaultState: IClimbingDataContext = {
  data: null,
  updateData: () => {},
  dataTimeRange: "",
  updateDataTimeRange: () => {},
}

export const ClimbingDataContext = createContext<IClimbingDataContext>(
  dataDefaultState
)

export const ClimbingDataContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [data, setData] = useState<ClimbingData | null>(null)
  const updateData = (saveData: ClimbingData | null) => {
    setData(saveData)
  }
  const [dataTimeRange, setDataTimeRange] = useState<string>("")
  const updateDataTimeRange = (saveRange: string) => {
    setDataTimeRange(saveRange)
  }

  const dataContextValue: IClimbingDataContext = {
    data,
    updateData,
    dataTimeRange,
    updateDataTimeRange,
  }

  return (
    <ClimbingDataContext.Provider value={dataContextValue}>
      {children}
    </ClimbingDataContext.Provider>
  )
}
