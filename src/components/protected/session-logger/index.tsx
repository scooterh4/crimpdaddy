import React, { useState } from "react"
import { Button, Grid, Typography } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { AppColors, ThemeColors } from "../../../static/styles"
import { Routes } from "../../../router"
import { ConfirmDialog } from "../../common/confirm-dialog"
import { ClimbsLoggedDisplay } from "./climbs-logged-display"
import { LogClimbDialog } from "./log-climb-dialog"
import {
  SessionLoggerProvider,
  useBoulderData,
  useRouteData,
  useSessionAPI,
  useSessionStart,
} from "./context/session-logger-context"
import { useAuthContext } from "../../app/context/auth-context"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { assembleUserSessionData } from "../../../util/data-helper-functions"
import { useProtectedContext } from "../context/protected-context"

export default function SessionLoggerPage() {
  return (
    <SessionLoggerProvider>
      <SessionLogger />
    </SessionLoggerProvider>
  )
}

function SessionLogger() {
  const { onLogSession } = useSessionAPI()
  const sessionStart = useSessionStart()
  const { updateSessionStorageData } = useProtectedContext()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const boulderClimbs = useBoulderData()
  const routeClimbs = useRouteData()
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)

  function submitForm() {
    if (user) {
      const sessionData = boulderClimbs
        ? routeClimbs
          ? boulderClimbs.concat(routeClimbs)
          : boulderClimbs
        : routeClimbs

      const data = assembleUserSessionData(sessionStart, sessionData)
      onLogSession(data, user.id)

      // We are assuming the climbs got logged properly in the db
      updateSessionStorageData(data)
      toast.success("Session logged!")
      navigate(Routes.dashboard)
    }
  }

  return (
    <Grid
      container
      direction={"column"}
      style={{
        display: "flex",
      }}
    >
      <ConfirmDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        confirmRoute={Routes.dashboard}
      />

      <LogClimbDialog />

      <Button
        fullWidth={false}
        onClick={() => setOpenConfirmDialog(true)}
        sx={{
          alignSelf: "start",
          background: "none",
          border: "none",
          color: AppColors.danger,
          fontFamily: "poppins",
          marginTop: 2,
          textTransform: "none",
        }}
      >
        <ArrowBackIcon sx={{ marginRight: 1 }} />
        Cancel session
      </Button>

      <Typography
        color={ThemeColors.darkShade}
        fontFamily={"poppins"}
        gutterBottom
        marginTop={2}
        variant="h3"
      >
        Add climbs
      </Typography>

      <Grid container direction={"column"}>
        <ClimbsLoggedDisplay title="Boulders" />
        <ClimbsLoggedDisplay title="Routes" />
      </Grid>

      <Button
        onClick={submitForm}
        size="large"
        variant="contained"
        sx={{
          backgroundColor: ThemeColors.darkAccent,
          color: "white",
          ":hover": { backgroundColor: ThemeColors.darkShade },
          fontFamily: "poppins",
          marginBottom: 5,
          marginTop: 3,
          textTransform: "none",
        }}
      >
        Log session
      </Button>
    </Grid>
  )
}
