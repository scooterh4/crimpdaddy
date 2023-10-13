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
import { AuthLayout } from "./auth-layout"

const protectedLayout = "/user"
export const Routes = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  resetPassword: "/resetPassword",
  dashboard: `${protectedLayout}/dashboard`,
  logClimb: `${protectedLayout}/logClimb`,
  gradePyramids: `${protectedLayout}/gradePyramids`,
  progression: `${protectedLayout}/progression`,
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />}>
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFound />} />
        <Route path={Routes.landing} element={<Landing />} />
        <Route path={Routes.login} element={<Login />} />
        <Route path={Routes.signup} element={<SignUp />} />
        <Route path={Routes.resetPassword} element={<ResetPassword />} />
      </Route>
      <Route path={protectedLayout} element={<ProtectedLayout />}>
        <Route path={Routes.dashboard} element={<Dashboard />} />
        <Route path={Routes.logClimb} element={<LogClimbPage />} />
        <Route path={Routes.gradePyramids} element={<GradePyramids />} />
        <Route path={Routes.progression} element={<ProgressionPage />} />
      </Route>
    </Route>
  )
)
