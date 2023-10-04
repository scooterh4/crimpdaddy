import React, { useEffect, useState } from "react"
import {
  Box,
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
} from "@mui/material"
import { BOULDER_GRADES, INDOOR_SPORT_GRADES } from "../constants"
import { useNavigate } from "react-router-dom"
import AppToolbar from "../components/common/app-toolbar"
import { useUserContext } from "../user-context"
import { AppColors, ThemeColors, drawerWidth } from "../styles/styles"
import { ClimbLog } from "../types"
import { logClimb } from "../util/db"
import AppFooter from "../components/common/app-footer"
import moment from "moment"
import GradeSelector from "../components/metrics/grade-selector"
import TickSelector from "../components/metrics/tick-selector"
import { toast } from "react-toastify"

export default function LogClimbPage() {
  const navigate = useNavigate()
  const { user, addClimbLogData } = useUserContext()
  const [climbType, setClimbType] = useState("")
  const [gradesList, setGradesList] = useState<string[]>([])
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedTick, setSelectedTick] = useState("")
  const [selectedTickDescription, setSelectedTickDescription] = useState("")
  const [showAttemptInput, setAttemptInputVisibility] = useState(false)
  const [attemptCount, setAttemptCount] = useState<number | string>("")
  const [attemptError, setAttemptError] = useState(false)

  useEffect(() => {
    setGradesList(
      climbType === "Boulder" ? BOULDER_GRADES : INDOOR_SPORT_GRADES
    )
    setSelectedGrade("")
    setSelectedTick("")
    setSelectedTickDescription("")
    setAttemptInputVisibility(false)
    setAttemptCount("")
  }, [climbType])

  function formHasError() {
    let hasError = false

    if (selectedTick !== "Onsight" && selectedTick !== "Flash") {
      if (!attemptCount || attemptCount === "") {
        setAttemptError(true)
        hasError = true
      }
    }

    return hasError
  }

  function submitForm() {
    if (!formHasError()) {
      let newClimbLogData: ClimbLog[] = []
      if (user) {
        // If they picked repeat or redpoint, log the climb and the attempts seperately
        const climbData: ClimbLog = {
          ClimbType: climbType,
          Grade: selectedGrade,
          Tick: selectedTick,
          Count:
            selectedTick === "Attempt" ? parseInt(attemptCount.toString()) : 1,
          UnixTime: moment().unix(),
        }

        newClimbLogData.push(climbData)
        logClimb(climbData, user.id)

        let toastMessage = `Climb logged: `
        toastMessage +=
          selectedTick === "Attempt"
            ? `${climbData.Grade} Attempt${
                parseInt(attemptCount.toString()) > 1 ? "s" : ""
              } (${parseInt(attemptCount.toString())})`
            : `${climbData.Grade} ${climbData.Tick}`

        const attempts = parseInt(attemptCount.toString()) - 1
        if (
          (selectedTick === "Redpoint" || selectedTick === "Repeat") &&
          attempts > 0
        ) {
          const attemptData: ClimbLog = {
            ClimbType: climbType,
            Grade: selectedGrade,
            Tick: "Attempt",
            Count: attempts,
            UnixTime: moment().unix(),
          }

          newClimbLogData.push(attemptData)
          logClimb(attemptData, user.id)
          toastMessage += ` with ${attempts} failed Attempt${
            attempts > 1 ? "s" : ""
          }`
        }

        // We are assuming the climbs got logged properly in the db
        addClimbLogData(newClimbLogData)
        navigate("/dashboard")
        toast.success(toastMessage, { toastId: "climbLogged" })
      }
    } else {
      console.log("logClimb formHasError")
    }
  }

  const handleFilterChange = (event: SelectChangeEvent) => {
    if (event.target.value !== undefined) {
      setClimbType(event.target.value)
      setGradesList(
        event.target.value === "Boulder" ? BOULDER_GRADES : INDOOR_SPORT_GRADES
      )
    }
  }

  return (
    <>
      <Box
        minHeight={"94.2vh"}
        sx={{ backgroundColor: ThemeColors.backgroundColor, display: "flex" }}
      >
        <AppToolbar title="Dashboard" />

        <Box
          component="main"
          marginTop={5}
          sx={{
            flexGrow: 1,
            p: 3,
            width: { lg: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
          }}
        >
          <Grid
            container
            direction={"column"}
            style={{
              display: "flex",
            }}
          >
            <Typography
              color={ThemeColors.darkShade}
              fontFamily={"poppins"}
              gutterBottom
              paddingTop={2}
              variant="h3"
            >
              Log a climb
            </Typography>

            <FormControl
              fullWidth
              sx={{ backgroundColor: "white", marginTop: 2 }}
            >
              <InputLabel id="climb_type_label">Climb Type</InputLabel>
              <Select
                id="climbTypeSelect"
                label={"Climb Type"}
                labelId="climb_type_label"
                onChange={handleFilterChange}
                value={climbType}
                sx={{ fontFamily: "poppins" }}
              >
                <MenuItem
                  key={"boulder"}
                  value={"Boulder"}
                  sx={{ fontFamily: "poppins" }}
                >
                  Boulder
                </MenuItem>
                <MenuItem
                  key={"lead"}
                  value={"Lead"}
                  sx={{ fontFamily: "poppins" }}
                >
                  Lead
                </MenuItem>
                <MenuItem
                  key={"topRope"}
                  value={"TopRope"}
                  sx={{ fontFamily: "poppins" }}
                >
                  Top Rope
                </MenuItem>
              </Select>
            </FormControl>

            {climbType !== "" && (
              <Grid container direction={"column"} marginTop={4}>
                <Typography fontFamily={"poppins"}>
                  What was the grade?
                </Typography>
                <GradeSelector
                  gradesList={gradesList}
                  selectedGrade={selectedGrade}
                  setSelectedGrade={setSelectedGrade}
                />
              </Grid>
            )}

            {selectedGrade !== "" && (
              <Grid container direction={"column"}>
                <Typography
                  fontFamily={"poppins"}
                  marginTop={2}
                  marginBottom={2}
                >
                  Select a tick:
                </Typography>
                <TickSelector
                  selectedTick={selectedTick}
                  setSelectedTick={setSelectedTick}
                  setAttemptInputVisibility={setAttemptInputVisibility}
                  setSelectedTickDescription={setSelectedTickDescription}
                />
              </Grid>
            )}

            {selectedTickDescription !== "" && (
              <Typography
                border={1}
                borderRadius={5}
                fontWeight={"bold"}
                marginTop={5}
                textAlign={"center"}
                padding={2}
                variant="h6"
                sx={{ color: AppColors.info, backgroundColor: "white" }}
              >
                {selectedTickDescription}
              </Typography>
            )}

            {showAttemptInput && (
              <FormControl fullWidth sx={{ marginTop: 5 }}>
                <TextField
                  error={attemptError}
                  label={"Number of attempts"}
                  onChange={(e) =>
                    setAttemptCount(
                      e.target.value !== "" ? parseInt(e.target.value) : ""
                    )
                  }
                  type="number"
                  value={attemptCount}
                  variant="outlined"
                  sx={{ backgroundColor: "white" }}
                >
                  {attemptCount}
                </TextField>
                {attemptError && (
                  <FormHelperText sx={{ color: AppColors.danger }}>
                    This is required!
                  </FormHelperText>
                )}
              </FormControl>
            )}

            {selectedTick !== "" && (
              <Button
                onClick={submitForm}
                size="large"
                variant="contained"
                sx={{
                  backgroundColor: ThemeColors.darkAccent,
                  color: "white",
                  ":hover": { backgroundColor: ThemeColors.darkShade },
                  marginBottom: 5,
                  marginTop: 5,
                }}
              >
                Submit
              </Button>
            )}
          </Grid>
        </Box>
      </Box>
      <AppFooter isAuthenticated={true} />
    </>
  )
}
