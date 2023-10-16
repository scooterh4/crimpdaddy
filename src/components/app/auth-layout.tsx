import React from "react"
import { useOutlet } from "react-router-dom"
import { AuthProvider } from "./auth-context"

export const AuthLayout = () => {
  const outlet = useOutlet()

  return <AuthProvider>{outlet}</AuthProvider>
}
