import React, { useMemo, useState } from "react"
import {
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
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
} from "./session-logger-context"
import moment, { Moment } from "moment"
import { useAuthContext } from "../../app/auth-context"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export default function SessionLoggerPage() {
  return (
    <SessionLoggerProvider>
      <SessionLogger />
    </SessionLoggerProvider>
  )
}

function SessionLogger() {
  const { onSessionStart, onLogSession } = useSessionAPI()
  const navigate = useNavigate()
  const [sessionStart] = useState<Moment>(moment())
  const { user } = useAuthContext()
  const boulderClimbs = useBoulderData()
  const routeClimbs = useRouteData()
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const theme = useTheme()
  const lgAndDownScreen = useMediaQuery(theme.breakpoints.down("lg"))

  useMemo(() => {
    onSessionStart(sessionStart)
  }, [])

  function submitForm() {
    if (user) {
      const data = boulderClimbs
        ? routeClimbs
          ? boulderClimbs.concat(routeClimbs)
          : boulderClimbs
        : routeClimbs

      onLogSession(sessionStart, data, user.id)
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

      {lgAndDownScreen && (
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
      )}

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
