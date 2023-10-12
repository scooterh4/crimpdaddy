import React from "react"
import { Navigate, useOutlet } from "react-router-dom"

export default function PublicLayout() {
  const isAuthenticated = !!sessionStorage.getItem("Auth Token")
  const outlet = useOutlet()

  if (isAuthenticated) {
    return <Navigate to="/user/dashboard" />
  }

  return <div>{outlet}</div>
}
