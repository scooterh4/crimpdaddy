import React, { useState } from "react"
import { Button, Grid, Typography } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { AppColors, ThemeColors } from "../../../../static/styles"
import { Routes } from "../../../../router"
import { ConfirmDialog } from "../../../common/confirm-dialog"
import { ClimbsLoggedDisplay } from "./components/climbs-logged-display"
import { LogClimbDialog } from "./components/log-climb-dialog"
import {
  SessionLoggerProvider,
  useBoulderData,
  useRouteData,
  useSessionAPI,
  useSessionStart,
} from "./context/session-logger-context"
import { useAuthContext } from "../../../app/context/auth-context"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import {
  assembleUserSessionData,
  findNewRedpointGrades,
} from "./utils/data-helper-functions"
import {
  useProtectedAPI,
  useUserClimbingDataContext,
} from "../context/protected-context"
import { UserIndoorRedpointGradesDoc } from "../../../../static/types"

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
  const { onUpdateDataUpdated, onAddUserClimbingData } = useProtectedAPI()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const userClimbingData = useUserClimbingDataContext()
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
      let redpointGrades: UserIndoorRedpointGradesDoc

      if (userClimbingData) {
        redpointGrades = findNewRedpointGrades(
          userClimbingData.indoorRedpointGrades,
          data.climbs
        )
      } else {
        redpointGrades = {
          boulder: "",
          lead: "",
          topRope: "",
        }
      }

      data.newRedpointGrades = redpointGrades
      const climbSession = {
        sessionMetadata: data.sessionMetadata,
        climbs: data.climbs,
      }

      onLogSession(user.id, climbSession, redpointGrades)
      onAddUserClimbingData(data) // we assume the data got added to the db successfully
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
