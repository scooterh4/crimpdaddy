import React from "react"
import { RouterProvider } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import { CssBaseline } from "@mui/material"
import { ToastContainer } from "react-toastify"
import { router } from "./router"

export default function App() {
  return (
    <CssBaseline>
      <ToastContainer position="top-right" />
      <RouterProvider router={router} />
    </CssBaseline>
  )
}
