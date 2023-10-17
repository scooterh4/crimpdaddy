import React, { useEffect, useState } from "react"
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { BOULDER_GRADES, INDOOR_SPORT_GRADES } from "../../../static/constants"
import { Route, useNavigate } from "react-router-dom"
import { useUserContext } from "../user-context"
import { AppColors, ThemeColors } from "../../../static/styles"
import { ClimbLog } from "../../../static/types"
import { logClimb } from "../../../util/db"
import moment from "moment"
import GradeSelector from "./grade-selector"
import TickSelector from "./tick-selector"
import { toast } from "react-toastify"
import { useAuthContext } from "../../app/auth-context"
import { Routes } from "../../../router"
import { ConfirmDialog } from "../../common/confirm-dialog"
import { ClimbsLogged } from "./climbs-logged"
import { LogClimbDialog } from "./log-climb-dialog"
import {
  SessionLoggerProvider,
  useBoulderData,
  useRouteData,
} from "./session-logger-context"

function SessionLogger() {
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const theme = useTheme()
  const lgAndDownScreen = useMediaQuery(theme.breakpoints.down("lg"))

  // function formHasError() {
  //   let hasError = false

  //   if (selectedTick !== "Onsight" && selectedTick !== "Flash") {
  //     if (!attemptCount || attemptCount === "") {
  //       setAttemptError(true)
  //       hasError = true
  //     }
  //   }

  //   return hasError
  // }

  function submitForm() {
    console.log("Submit form")
    // if (!formHasError()) {
    //   let newClimbLogData: ClimbLog[] = []
    //   if (user) {
    //     // If they picked repeat or redpoint, log the climb and the attempts seperately
    //     const climbData: ClimbLog = {
    //       ClimbType: climbType,
    //       Grade: selectedGrade,
    //       Tick: selectedTick,
    //       Count:
    //         selectedTick === "Attempt" ? parseInt(attemptCount.toString()) : 1,
    //       UnixTime: moment().unix(),
    //     }

    //     newClimbLogData.push(climbData)
    //     logClimb(climbData, user.id)

    //     let toastMessage = `Climb logged: `
    //     toastMessage +=
    //       selectedTick === "Attempt"
    //         ? `${climbData.Grade} Attempt${
    //             parseInt(attemptCount.toString()) > 1 ? "s" : ""
    //           } (${parseInt(attemptCount.toString())})`
    //         : `${climbData.Grade} ${climbData.Tick}`

    //     const attempts = parseInt(attemptCount.toString()) - 1
    //     if (
    //       (selectedTick === "Redpoint" || selectedTick === "Repeat") &&
    //       attempts > 0
    //     ) {
    //       const attemptData: ClimbLog = {
    //         ClimbType: climbType,
    //         Grade: selectedGrade,
    //         Tick: "Attempt",
    //         Count: attempts,
    //         UnixTime: moment().unix(),
    //       }

    //       newClimbLogData.push(attemptData)
    //       logClimb(attemptData, user.id)
    //       toastMessage += ` with ${attempts} failed Attempt${
    //         attempts > 1 ? "s" : ""
    //       }`
    //     }

    //     // We are assuming the climbs got logged properly in the db
    //     addClimbLogData(newClimbLogData)
    //     navigate(Routes.dashboard)
    //     toast.success(toastMessage, { toastId: "climbLogged" })
    //   }
    // } else {
    //   console.log("logClimb formHasError")
    // }
  }

  // const handleFilterChange = (event: SelectChangeEvent) => {
  //   if (event.target.value !== undefined) {
  //     setClimbType(event.target.value)
  //     setGradesList(
  //       event.target.value === "Boulder" ? BOULDER_GRADES : INDOOR_SPORT_GRADES
  //     )
  //   }
  // }

  console.log("Session-logger page render")

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
        <ClimbsLogged title="Boulders" />
        <ClimbsLogged title="Routes" />
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

export default function SessionLoggerPage() {
  return (
    <SessionLoggerProvider>
      <SessionLogger />
    </SessionLoggerProvider>
  )
}
