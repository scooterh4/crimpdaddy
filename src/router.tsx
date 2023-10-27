import React from "react"
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import PublicLayout from "./components/public/public-layout"
import NotFound from "./components/public/not-found"
import Landing from "./components/public/landing"
import Login from "./components/public/login"
import SignUp from "./components/public/sign-up"
import ResetPassword from "./components/public/reset-password"
import UserLayout from "./components/protected/protected-layout"
import Dashboard from "./components/protected/dashboard/index"
import LogClimbPage from "./components/protected/climb-logger"
import SessionLogger from "./components/protected/session-logger"
import GradePyramids from "./components/protected/grade-pyramids/index"
import ProgressionPage from "./components/protected/progression"
import { AuthLayout } from "./components/app/auth-layout"

const protectedLayout = "/user"
export const Routes = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  resetPassword: "/resetPassword",
  dashboard: `${protectedLayout}/dashboard`,
  logClimb: `${protectedLayout}/logClimb`,
  climbSession: `${protectedLayout}/session`,
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
      <Route path={protectedLayout} element={<UserLayout />}>
        <Route path={Routes.dashboard} element={<Dashboard />} />
        <Route path={Routes.logClimb} element={<LogClimbPage />} />
        <Route path={Routes.climbSession} element={<SessionLogger />} />
        <Route path={Routes.gradePyramids} element={<GradePyramids />} />
        <Route path={Routes.progression} element={<ProgressionPage />} />
      </Route>
    </Route>
  )
)
