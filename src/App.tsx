import React from "react"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Landing from "./pages/Landing"
import ProtectedRoute, {
  ProtectedRouteProps,
} from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import LogClimbPage from "./pages/LogClimb"
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
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<Dashboard />}
              />
            }
          />
          <Route
            path="logClimb"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<LogClimbPage />}
              />
            }
          />
        </Routes>
      </Router>
    </UserContextProvider>
  )
}

export default App
