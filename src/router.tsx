import React from "react"
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import PublicLayout from "./components/app/public-layout"
import NotFound from "./components/app/not-found"
import Landing from "./components/landing"
import Login from "./components/login"
import SignUp from "./components/sign-up"
import ResetPassword from "./components/app/reset-password"
import ProtectedLayout from "./components/app/protected-layout"
import Dashboard from "./components/dashboard/index"
import LogClimbPage from "./components/climb-logger"
import GradePyramids from "./components/grade-pyramids/index"
import ProgressionPage from "./components/progression"
import { AuthLayout } from "./components/app/auth-layout"

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
