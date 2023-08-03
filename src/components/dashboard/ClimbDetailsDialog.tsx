import React, { useContext, useEffect, useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import {
  TICK_TYPES,
  BOULDER_GRADES,
  INDOOR_SPORT_GRADES,
  GYM_CLIMB_TYPES,
} from "../../static/constants"
import { LogClimb } from "../../db/ClimbLogService"
import { UserContext } from "../../db/Context"
import { ClimbLog } from "../../static/types"
import { Timestamp } from "firebase/firestore"

export type LogModalProps = {
  open: boolean
  handleClose: () => void
  climbType: number
}

function LogModal({ open, handleClose, climbType }: LogModalProps) {
  const { user } = useContext(UserContext)
  const [grade, setGrade] = useState("")
  const [tick, setTick] = useState("")
  const [count, setCount] = useState<number | string>("")
  const [countLabel, setCountLabel] = useState<string>("Number of climbs")
  const grades =
    climbType === GYM_CLIMB_TYPES.Boulder ? BOULDER_GRADES : INDOOR_SPORT_GRADES

  const [gradeError, setGradeError] = useState(false)
  const [tickError, setTickError] = useState(false)
  const [attemptError, setAttemptError] = useState(false)

  useEffect(() => {
    if (tick === "Attempt") {
      setCountLabel("Number of attempts")
    } else {
      setCountLabel("Number of climbs")
    }
  }, [tick])

  function validateForm() {
    let hasError = false

    if (!grade) {
      setGradeError(true)
      hasError = true
    }
    if (!tick) {
      setTickError(true)
      hasError = true
    }
    if (!count) {
      setAttemptError(true)
      hasError = true
    }

    return hasError
  }

  function resetForm() {
    setGrade("")
    setTick("")
    setCount("")
    setGradeError(false)
    setTickError(false)
    setAttemptError(false)
  }

  function handleSubmit() {
    if (!validateForm()) {
      console.log("Form data:", GYM_CLIMB_TYPES[climbType], grade, tick, count)
      handleClose()
      logClimb()
      resetForm()
    } else {
      console.log("Error!")
    }
  }

  function logClimb() {
    if (user) {
      const climbData: ClimbLog = {
        UserId: user.id,
        ClimbType: GYM_CLIMB_TYPES[climbType],
        Grade: grade,
        Tick: tick,
        Count: parseInt(count.toString()),
        Timestamp: Timestamp.now(),
      }

      LogClimb(climbData)
    }
  }

  function handleCancel() {
    handleClose()
    resetForm()
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <FormControl fullWidth margin="normal" error={gradeError}>
            <InputLabel>Grade</InputLabel>
            <Select
              label="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              {grades.map((grade, index) => (
                <MenuItem key={index} value={grade}>
                  {grade}
                </MenuItem>
              ))}
            </Select>
            {gradeError && <FormHelperText>This is required!</FormHelperText>}
          </FormControl>
          <FormControl fullWidth margin="normal" error={tickError}>
            <InputLabel>Tick</InputLabel>
            <Select
              label="Tick"
              value={tick}
              onChange={(e) => setTick(e.target.value)}
            >
              {TICK_TYPES.map((tick, index) => (
                <MenuItem key={index} value={tick}>
                  {tick}
                </MenuItem>
              ))}
            </Select>
            {tickError && <FormHelperText>This is required!</FormHelperText>}
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label={countLabel}
              value={count}
              type="number"
              error={attemptError}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onChange={(e) =>
                setCount(e.target.value !== "" ? parseInt(e.target.value) : "")
              }
            >
              {count}
            </TextField>
            {attemptError && (
              <FormHelperText error>This is required!</FormHelperText>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ display: "flex", marginLeft: "auto" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button variant="text" color="error" onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LogModal
