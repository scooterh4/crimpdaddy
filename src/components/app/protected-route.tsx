import React, { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { auth } from "../../firebase"
import { Unsubscribe, onAuthStateChanged } from "firebase/auth"
import { useUserContext } from "../context/user-context"

export type ProtectedRouteProps = {
  authenticationPath: string
  outlet: JSX.Element
}

export default function ProtectedRoute({
  authenticationPath,
  outlet,
}: ProtectedRouteProps) {
  const isAuthenticated = !!sessionStorage.getItem("Auth Token")
  const { user, updateUser } = useUserContext()

  useEffect(() => {
    const subscriber: Unsubscribe = onAuthStateChanged(
      auth,
      (persistedUser) => {
        // user refreshed the page
        if (persistedUser && !user) {
          updateUser({
            id: persistedUser.uid,
            email: persistedUser.email ? persistedUser.email : "",
          })
          return outlet
        }
      }
    )

    // Unsubscribe the listener when the component is unmounted
    return () => subscriber()
  }, [])

  // Normal sign in case
  if (isAuthenticated) {
    return outlet
  } else {
    return <Navigate to={{ pathname: authenticationPath }} />
  }
}
