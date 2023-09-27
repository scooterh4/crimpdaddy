import React from "react"
import SignIn from "./pages/sign-in"
import SignUp from "./pages/sign-up"
import Landing from "./pages/landing"
import ProtectedRoute, { ProtectedRouteProps } from "./pages/protected-route"
import Dashboard from "./pages/dashboard"
import LogClimbPage from "./pages/log-climb"
import GradePyramids from "./pages/grade-pyramids"
import ProgressionPage from "./pages/progression"
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import { CssBaseline } from "@mui/material"
import { ToastContainer } from "react-toastify"
import { UserDataProvider } from "./user-context"

const App = () => {
  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    authenticationPath: "/login",
  }

  return (
    <UserDataProvider>
      <CssBaseline />
      <ToastContainer position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<Dashboard />}
              />
            }
          />
          <Route
            path="/logClimb"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<LogClimbPage />}
              />
            }
          />
          <Route
            path="/gradePyramids"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<GradePyramids />}
              />
            }
          />
          <Route
            path="/progression"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<ProgressionPage />}
              />
            }
          />
        </Routes>
      </Router>
    </UserDataProvider>
  )
}

export default App
