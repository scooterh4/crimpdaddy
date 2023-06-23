import React, { useContext, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { toast } from "react-toastify"
import { auth } from "../firebase"
import { Unsubscribe, onAuthStateChanged } from "firebase/auth"
import { UserContext } from "../Context"

export type ProtectedRouteProps = {
  authenticationPath: string
  outlet: JSX.Element
}

function ProtectedRoute({ authenticationPath, outlet }: ProtectedRouteProps) {
  const isAuthenticated = !!sessionStorage.getItem("Auth Token")
  const { user, updateUser } = useContext(UserContext)

  useEffect(() => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      (persistedUser) => {
        // user refreshed the page
        if (persistedUser && !user) {
          // console.log(persistedUser.uid)
          updateUser({
            id: persistedUser.uid,
            email: persistedUser.email ? persistedUser.email : "",
          })
        }
      }
    )

    // Unsubscribe the listener when the component is unmounted
    return () => unsubscribe()
  }, [])

  // Normal sign in case
  if (isAuthenticated) {
    return outlet
  } else {
    // toast.error("Nice try! Please login first", { toastId: "niceTry" })

    return <Navigate to={{ pathname: authenticationPath }} />
  }
}

export default ProtectedRoute
