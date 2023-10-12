import React from "react"
import { RouterProvider } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import { CssBaseline } from "@mui/material"
import { ToastContainer } from "react-toastify"
import { UserDataProvider } from "./components/context/user-context"
import { router } from "./components/app/router"

export default function App() {
  return (
    <UserDataProvider>
      <CssBaseline />
      <ToastContainer position="top-right" />
      <RouterProvider router={router} />
    </UserDataProvider>
  )
}
