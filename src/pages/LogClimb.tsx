import React, { useContext, useEffect, useState } from "react"
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
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
  INDOOR_SPORT_GRADES,
  TICK_TYPES,
} from "../static/constants"
import { useNavigate } from "react-router-dom"
import AppToolbar from "../components/common/AppToolbar"
import { UserContext } from "../db/Context"
import {
  AppColors,
  GraphColors,
  ThemeColors,
  drawerWidth,
} from "../static/styles"
import VisibilityIcon from "@mui/icons-material/Visibility"
import BoltIcon from "@mui/icons-material/Bolt"
import CircleIcon from "@mui/icons-material/Circle"
import ReplayIcon from "@mui/icons-material/Replay"
import CancelIcon from "@mui/icons-material/Cancel"
import { ClimbLog } from "../static/types"
import { Timestamp } from "firebase/firestore"
import { LogClimb } from "../db/ClimbLogService"
import AppFooter from "../components/common/AppFooter"

function LogClimbPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useContext(UserContext)
  const [climbType, setClimbType] = useState("")
  const [gradesList, setGradesList] = useState<string[]>([])
  const [grade, setGrade] = useState("")
  const [selectedTick, setSelectedTick] = useState("")
  const [selectedTickDescription, setSelectedTickDescription] = useState("")
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

  const tickDescriptions = {
    Onsight:
      "You completed the route on your first attempt without any prior knowledge of how to complete it.",
    Flash:
      "You completed the route on your first attempt but had prior knowledge of how to complete it.",
    Redpoint: "You completed the route but it was not your first attempt.",
    Repeat: "You have already completed the route and sent it again.",
    Attempt: "You did not completed the route.",
  }

  const tickButtonClicked = (event: React.MouseEvent<HTMLElement>) => {
    const value = event.currentTarget.getAttribute("value")

    if (value !== null) {
      setSelectedTick(value.toString())

      value.toString() !== "Onsight" && value.toString() !== "Flash"
        ? setAttemptInputVisibility(true)
        : setAttemptInputVisibility(false)

      switch (value.toString()) {
        case "Onsight":
          setSelectedTickDescription(tickDescriptions.Onsight)
          break

        case "Flash":
          setSelectedTickDescription(tickDescriptions.Flash)
          break

        case "Redpoint":
          setSelectedTickDescription(tickDescriptions.Redpoint)
          break

        case "Repeat":
          setSelectedTickDescription(tickDescriptions.Repeat)
          break

        case "Attempt":
          setSelectedTickDescription(tickDescriptions.Attempt)
          break

        default:
          setSelectedTickDescription("")
          break
      }
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
      <Box sx={{ display: "flex" }}>
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
                              selectedTick === tick
                                ? tickColors[index]
                                : "white",
                            color:
                              selectedTick === tick
                                ? "white"
                                : tickColors[index],
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
              </Grid>
            )}

            {selectedTickDescription !== "" && (
              <Typography
                border={1}
                borderRadius={5}
                fontWeight={"bold"}
                marginTop={5}
                textAlign={"center"}
                variant="h6"
                sx={{ color: AppColors.info }}
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
      <AppFooter drawerWidth={drawerWidth} />
    </>
  )
}

export default LogClimbPage
