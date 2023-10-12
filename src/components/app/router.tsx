import React from "react"
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import PublicLayout from "./public-layout"
import NotFound from "./not-found"
import Landing from "../landing"
import Login from "../login"
import SignUp from "../sign-up"
import ResetPassword from "./reset-password"
import ProtectedLayout from "./protected-layout"
import Dashboard from "../dashboard/index"
import LogClimbPage from "../climb-logger"
import GradePyramids from "../grade-pyramids/index"
import ProgressionPage from "../progression"

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* <Route element={<AuthLayout />}> */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
      </Route>
      <Route path="/user" element={<ProtectedLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="logClimb" element={<LogClimbPage />} />
        <Route path="gradePyramids" element={<GradePyramids />} />
        <Route path="progression" element={<ProgressionPage />} />
      </Route>
      {/* </Route> */}
    </>
  )
)
