import React from "react"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Landing from "./pages/Landing"
import ProtectedRoute, {
  ProtectedRouteProps,
} from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import LogClimbPage from "./pages/LogClimb"
import GradePyramids from "./pages/GradePyramids"
import ProgressionPage from "./pages/Progression"
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import { CssBaseline } from "@mui/material"
import { ToastContainer } from "react-toastify"
import { UserContextProvider } from "./components/context-api"

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
          <Route path="/signin" element={<SignIn />} />
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
    </UserContextProvider>
  )
}

export default App
