import React, { useState } from "react"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import Landing from "./pages/Landing"
import ProtectedRoute, {
  ProtectedRouteProps,
} from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import { CssBaseline } from "@mui/material"
import { ToastContainer } from "react-toastify"
import { UserContextProvider } from "./db/Context"

const App = () => {
  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    authenticationPath: "/signin",
  }

  return (
    <UserContextProvider>
      <CssBaseline />
      <ToastContainer position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<Dashboard />}
              />
            }
          />
        </Routes>
      </Router>
    </UserContextProvider>
  )
}

export default App
