import React from "react"
import Login from "./components/login"
import SignUp from "./components/sign-up"
import Landing from "./components/landing"
import ProtectedRoute, {
  ProtectedRouteProps,
} from "./components/app/protected-route"
import NotFound from "./components/app/not-found"
import Dashboard from "./components/dashboard"
import LogClimbPage from "./components/climb-logger"
import GradePyramids from "./components/grade-pyramids"
import ProgressionPage from "./components/progression"
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import { CssBaseline } from "@mui/material"
import { ToastContainer } from "react-toastify"
import { UserDataProvider } from "./components/context/user-context"

export default function App() {
  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    authenticationPath: "/login",
  }

  return (
    <UserDataProvider>
      <CssBaseline />
      <ToastContainer position="top-right" />
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
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
