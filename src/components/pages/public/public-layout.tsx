import React from "react"
import { Navigate, useOutlet } from "react-router-dom"

export default function PublicLayout() {
  // Would like to just import the user object from the authContext but can't get it to work
  const isAuthenticated = !!sessionStorage.getItem("authToken")
  const outlet = useOutlet()

  if (isAuthenticated) {
    return <Navigate to="/user/dashboard" />
  }

  return <div>{outlet}</div>
}
