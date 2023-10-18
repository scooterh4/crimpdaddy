import React, { useState } from "react"
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
import { ClimbsLogged } from "./climbs-logged"
import { LogClimbDialog } from "./log-climb-dialog"
import { SessionLoggerProvider } from "./session-logger-context"

export default function SessionLoggerPage() {
  return (
    <SessionLoggerProvider>
      <SessionLogger />
    </SessionLoggerProvider>
  )
}

function SessionLogger() {
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const theme = useTheme()
  const lgAndDownScreen = useMediaQuery(theme.breakpoints.down("lg"))

  function submitForm() {
    // process the data into ClimbLog[] format and send it to the API
    console.log("Submit form")
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
