import React, { useContext, useEffect, useState } from "react"
import {
  Button,
  Container,
  Fab,
  FormControl,
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material"
import {
  BOULDER_GRADES,
  GYM_CLIMB_TYPES,
  INDOOR_SPORT_GRADES,
  TICK_TYPES,
} from "../static/constants"
import { useNavigate } from "react-router-dom"
import Toolbar from "../components/common/ToolBar"
import { UserContext } from "../db/Context"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import { AppColors, GraphColors, ThemeColors } from "../static/styles"
import VisibilityIcon from "@mui/icons-material/Visibility"
import BoltIcon from "@mui/icons-material/Bolt"
import CircleIcon from "@mui/icons-material/Circle"
import ReplayIcon from "@mui/icons-material/Replay"
import CancelIcon from "@mui/icons-material/Cancel"
import HelpCenterIcon from "@mui/icons-material/HelpCenter"
import { ClimbLog } from "../static/types"
import { Timestamp } from "firebase/firestore"
import { LogClimb } from "../db/ClimbLogService"
import App from "../App"
import Footer from "../components/common/Footer"

function LogClimbPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useContext(UserContext)
  const [climbType, setClimbType] = useState("")
  const [gradesList, setGradesList] = useState<string[]>([])
  const [grade, setGrade] = useState("")
  const [selectedTick, setSelectedTick] = useState("")
  const [showAttemptInput, setAttemptInputVisibility] = useState(false)
  const [attemptCount, setAttemptCount] = useState<number | string>("")

  const [gradeError, setGradeError] = useState(false)
  const [tickError, setTickError] = useState(false)
  const [attemptError, setAttemptError] = useState(false)

  const tickIcons = [
    VisibilityIcon,
    BoltIcon,
    CircleIcon,
    ReplayIcon,
    CancelIcon,
  ]
  const tickColors = [
    GraphColors.Onsight,
    GraphColors.Flash,
    GraphColors.Redpoint,
    AppColors.info,
    AppColors.danger,
  ]

  const tickButtonClicked = (event: React.MouseEvent<HTMLElement>) => {
    const value = event.currentTarget.getAttribute("value")

    if (value !== null) {
      setSelectedTick(value.toString())

      value.toString() !== "Onsight" && value.toString() !== "Flash"
        ? setAttemptInputVisibility(true)
        : setAttemptInputVisibility(false)
    }
  }

  function formHasError() {
    let hasError = false

    if (!grade || grade === "") {
      setGradeError(true)
      hasError = true
    }
    if (!selectedTick || selectedTick === "") {
      setTickError(true)
      hasError = true
    }
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
      if (user) {
        // If they picked repeat or redpoint, log the climb and the attempts seperately
        const climbData: ClimbLog = {
          UserId: user.id,
          ClimbType: climbType,
          Grade: grade,
          Tick: selectedTick,
          Count:
            selectedTick === "Attempt" ? parseInt(attemptCount.toString()) : 1,
          Timestamp: Timestamp.now(),
        }

        LogClimb(climbData)

        if (
          (selectedTick === "Redpoint" || selectedTick === "Repeat") &&
          parseInt(attemptCount.toString()) > 1
        ) {
          const attemptData: ClimbLog = {
            UserId: user.id,
            ClimbType: climbType,
            Grade: grade,
            Tick: "Attempt",
            Count: parseInt(attemptCount.toString()) - 1,
            Timestamp: Timestamp.now(),
          }

          LogClimb(attemptData)
        }
        console.log(user.id)
        navigate("/dashboard")
      }
    } else {
      console.log("Error!")
      // navigate("/dashboard")
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

  useEffect(() => {
    setGradesList(
      climbType === "Boulder" ? BOULDER_GRADES : INDOOR_SPORT_GRADES
    )
  }, [climbType])

  return (
    <>
      <Toolbar
        title={"Dashboard"}
        user={{ appUser: user, updateUser: updateUser }}
      />

      <Container maxWidth="md">
        <Grid
          container
          direction={"column"}
          style={{
            display: "flex",
          }}
        >
          <Button
            onClick={() => navigate("/dashboard")}
            size="large"
            variant="text"
            sx={{
              //backgroundColor: ThemeColors.lightAccent,
              color: AppColors.info,
              ":hover": {
                backgroundColor: ThemeColors.darkAccent,
                color: "white",
              },
              display: "flex",
              justifyContent: "left",
              marginTop: 2,
            }}
          >
            <ArrowBackIosIcon />
            Dashboard
          </Button>

          <Typography
            color={ThemeColors.darkShade}
            fontFamily={"poppins"}
            gutterBottom
            paddingTop={2}
            variant="h3"
          >
            Log a climb
          </Typography>

          <FormControl fullWidth sx={{ marginTop: 5 }}>
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
            <FormControl fullWidth sx={{ marginBottom: 5, marginTop: 5 }}>
              <InputLabel
                id="grade_label"
                sx={{
                  color: gradeError ? AppColors.danger : "black",
                }}
              >
                Grade
              </InputLabel>
              <Select
                error={gradeError}
                label={"Grade"}
                onChange={(e) => setGrade(e.target.value)}
                value={grade}
                sx={{ fontFamily: "poppins" }}
              >
                {gradesList.map((grade, index) => (
                  <MenuItem
                    key={grade}
                    value={grade}
                    sx={{ fontFamily: "poppins" }}
                  >
                    {grade}
                  </MenuItem>
                ))}
              </Select>
              {gradeError && (
                <FormHelperText sx={{ color: AppColors.danger }}>
                  This is required!
                </FormHelperText>
              )}
            </FormControl>
          )}

          {climbType !== "" && (
            <Grid container direction={"column"}>
              <Typography
                fontFamily={"poppins"}
                marginBottom={2}
                marginLeft={2}
              >
                Select a tick:
              </Typography>
              <Grid
                alignItems={"center"}
                container
                direction={"column"}
                justifyContent={"center"}
              >
                <Grid container direction={"row"}>
                  {TICK_TYPES.map((tick, index) => (
                    <Grid item xs>
                      <Button
                        key={index}
                        value={tick}
                        onClick={tickButtonClicked}
                        sx={{
                          backgroundColor:
                            selectedTick === tick ? tickColors[index] : "white",
                          color:
                            selectedTick === tick ? "white" : tickColors[index],
                          ":hover": {
                            backgroundColor:
                              selectedTick === tick
                                ? tickColors[index]
                                : ThemeColors.darkAccent,
                            color: "white",
                          },
                        }}
                      >
                        <Grid
                          alignItems={"center"}
                          container
                          direction={"column"}
                          justifyContent={"center"}
                        >
                          <SvgIcon
                            component={tickIcons[index]}
                            sx={{
                              color:
                                selectedTick === tick
                                  ? "white"
                                  : tickColors[index],
                              ":hover": {
                                color:
                                  selectedTick === tick
                                    ? "white"
                                    : tickColors[index],
                              },
                            }}
                          />
                          {tick}
                        </Grid>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* <Button
                variant="contained"
                sx={{
                  backgroundColor: AppColors.info,
                  color: "white",
                  marginTop: 5,
                  ":hover": { backgroundColor: ThemeColors.darkAccent },
                }}
              >
                <HelpCenterIcon />
              </Button> */}
            </Grid>
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
                backgroundColor: AppColors.primary,
                color: "white",
                ":hover": { backgroundColor: ThemeColors.darkAccent },
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              Submit
            </Button>
          )}
        </Grid>
      </Container>
    </>
  )
}

export default LogClimbPage
