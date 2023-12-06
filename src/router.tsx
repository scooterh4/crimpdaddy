import React from "react"
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import PublicLayout from "./components/pages/public/public-layout"
import NotFound from "./components/pages/public/not-found"
import Landing from "./components/pages/public/landing"
import Login from "./components/pages/public/login"
import SignUp from "./components/pages/public/sign-up"
import ResetPassword from "./components/pages/public/reset-password"
import ProtectedLayout from "./components/pages/protected/protected-layout"
import Dashboard from "./components/pages/protected/dashboard/index"
import SessionLogger from "./components/pages/protected/session-logger"
import GradePyramids from "./components/pages/protected/grade-pyramids/index"
import ProgressionPage from "./components/pages/protected/progression"
import { AuthLayout } from "./components/app/context/auth-layout"
import SessionLogsPage from "./components/pages/protected/session-logs"

const protectedLayout = "/user"
export const Routes = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  resetPassword: "/resetPassword",
  dashboard: `${protectedLayout}/dashboard`,
  sessionLogs: `${protectedLayout}/sessionLogs`,
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
      <Route path={protectedLayout} element={<ProtectedLayout />}>
        <Route path={Routes.dashboard} element={<Dashboard />} />
        <Route path={Routes.sessionLogs} element={<SessionLogsPage />} />
        <Route path={Routes.climbSession} element={<SessionLogger />} />
        <Route path={Routes.gradePyramids} element={<GradePyramids />} />
        <Route path={Routes.progression} element={<ProgressionPage />} />
      </Route>
    </Route>
  )
)
