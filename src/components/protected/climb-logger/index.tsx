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
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../protected-context"
import { AppColors, ThemeColors } from "../../../static/styles"
import { ClimbLog } from "../../../static/types"
import { logClimb } from "../../../util/db"
import moment from "moment"
import GradeSelector from "../session-logger/grade-selector"
import TickSelector from "../session-logger/tick-selector"
import { toast } from "react-toastify"
import { useAuthContext } from "../../app/auth-context"
import { Routes } from "../../../router"

export default function LogClimbPage() {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  // const { addClimbLogData } = useUserContext()
  const [climbType, setClimbType] = useState("")
  const [gradesList, setGradesList] = useState<string[]>([])
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedTick, setSelectedTick] = useState("")
  const [selectedTickDescription, setSelectedTickDescription] = useState("")
  const [showAttemptInput, setAttemptInputVisibility] = useState(false)
  const [attemptCount, setAttemptCount] = useState<number | string>("")
  const [attemptError, setAttemptError] = useState(false)
  const theme = useTheme()
  const lgAndDownScreen = useMediaQuery(theme.breakpoints.down("lg"))

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
          climbType: climbType,
          grade: selectedGrade,
          tick: selectedTick,
          count:
            selectedTick === "Attempt" ? parseInt(attemptCount.toString()) : 1,
          unixTime: moment().unix(),
        }

        newClimbLogData.push(climbData)
        logClimb(climbData, user.id)

        let toastMessage = `Climb logged: `
        toastMessage +=
          selectedTick === "Attempt"
            ? `${climbData.grade} Attempt${
                parseInt(attemptCount.toString()) > 1 ? "s" : ""
              } (${parseInt(attemptCount.toString())})`
            : `${climbData.grade} ${climbData.tick}`

        const attempts = parseInt(attemptCount.toString()) - 1
        if (
          (selectedTick === "Redpoint" || selectedTick === "Repeat") &&
          attempts > 0
        ) {
          const attemptData: ClimbLog = {
            climbType: climbType,
            grade: selectedGrade,
            tick: "Attempt",
            count: attempts,
            unixTime: moment().unix(),
          }

          newClimbLogData.push(attemptData)
          logClimb(attemptData, user.id)
          toastMessage += ` with ${attempts} failed Attempt${
            attempts > 1 ? "s" : ""
          }`
        }

        // We are assuming the climbs got logged properly in the db
        // addClimbLogData(newClimbLogData)
        navigate(Routes.dashboard)
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
    <Grid
      container
      direction={"column"}
      style={{
        display: "flex",
      }}
    >
      {lgAndDownScreen && (
        <Button
          fullWidth={false}
          onClick={() => navigate(Routes.dashboard)}
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
          Cancel
        </Button>
      )}

      <Typography
        color={ThemeColors.darkShade}
        fontFamily={"poppins"}
        gutterBottom
        marginTop={2}
        variant="h3"
      >
        Log a climb
      </Typography>

      <FormControl fullWidth sx={{ backgroundColor: "white", marginTop: 2 }}>
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
          <MenuItem key={"lead"} value={"Lead"} sx={{ fontFamily: "poppins" }}>
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
          <Typography fontFamily={"poppins"}>What was the grade?</Typography>
          <GradeSelector
            gradesList={gradesList}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
          />
        </Grid>
      )}

      {selectedGrade !== "" && (
        <Grid container direction={"column"}>
          <Typography fontFamily={"poppins"} marginTop={2} marginBottom={2}>
            Select a tick:
          </Typography>
          <TickSelector
            selectedTick={selectedTick}
            setSelectedTick={setSelectedTick}
            setAttemptInputVisibility={setAttemptInputVisibility}
            // setSelectedTickDescription={setSelectedTickDescription}
          />
        </Grid>
      )}

      {selectedTickDescription !== "" && (
        <Typography
          border={1}
          borderRadius={2}
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
  )
}
