import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import { toast } from "react-toastify"
import { auth } from "../firebase"
import { onAuthStateChanged } from "firebase/auth"
import { UserContext } from "../Context"
import { usersById } from "../db/user_service"

export type ProtectedRouteProps = {
  authenticationPath: string
  outlet: JSX.Element
}

function ProtectedRoute({ authenticationPath, outlet }: ProtectedRouteProps) {
  const isAuthenticated = !!sessionStorage.getItem("Auth Token")
  const { user, updateUser } = useContext(UserContext)

  onAuthStateChanged(auth, (persistedUser) => {
    // user refreshed the page
    if (persistedUser && !user) {
      usersById(persistedUser.uid).then((res) => {
        updateUser({
          id: res.id,
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
        })
      })
    }
  })

  // Normal sign in case
  if (isAuthenticated) {
    // Normal sign in case
    if (!user && auth.currentUser) {
      usersById(auth.currentUser.uid).then((res) => {
        updateUser({
          id: res.id,
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
        })
      })
    }

    return outlet
  } else {
    // toast.error("Nice try! Please login first", { toastId: "niceTry" })

    return <Navigate to={{ pathname: authenticationPath }} />
  }
}

export default ProtectedRoute
