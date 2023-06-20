import React, { useState } from "react"
import { AppUser } from "./@types/types"

interface IUserContext {
  user: AppUser | null
  updateUser: (newUser: AppUser) => void
}

const defaultState: IUserContext = {
  user: null,
  updateUser: () => {},
}

export const UserContext = React.createContext<IUserContext>(defaultState)

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<AppUser | null>(null)

  const updateUser = (saveUser: AppUser) => {
    setUser(saveUser)
  }

  const userContextValue: IUserContext = {
    user,
    updateUser,
  }

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  )
}
