import React, { useContext, useState } from "react"
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
} from "../static/constants"
import { LogClimb } from "../db/ClimbLogService"
import { UserContext } from "../Context"

export type LogModalProps = {
  open: boolean
  handleClose: () => void
  climbType: number
}

function LogModal({ open, handleClose, climbType }: LogModalProps) {
  const { user } = useContext(UserContext)
  const [grade, setGrade] = useState("")
  const [tick, setTick] = useState("")
  const [attempts, setAttempts] = useState<number | string>("")
  const grades =
    climbType === GYM_CLIMB_TYPES.Boulder ? BOULDER_GRADES : INDOOR_SPORT_GRADES

  const [gradeError, setGradeError] = useState(false)
  const [tickError, setTickError] = useState(false)
  const [attemptError, setAttemptError] = useState(false)

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
    if (!attempts) {
      setAttemptError(true)
      hasError = true
    }

    return hasError
  }

  function resetForm() {
    setGrade("")
    setTick("")
    setAttempts("")
    setGradeError(false)
    setTickError(false)
    setAttemptError(false)
  }

  function handleSubmit() {
    if (!validateForm()) {
      console.log("Submitted!")
      console.log("Form data:", climbType, grade, tick, attempts)
      handleClose()
      logClimb()
      resetForm()
    } else {
      console.log("Error!")
    }
  }

  function logClimb() {
    if (user) {
      LogClimb(user.id, climbType, grade, tick, attempts).then((res) => {
        console.log("Wagwan bruH!")
        console.log(res)
      })
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
              label="Number of attempts"
              value={attempts}
              onChange={(e) =>
                setAttempts(
                  e.target.value !== "" ? parseInt(e.target.value) : ""
                )
              }
              type="number"
              error={attemptError}
            >
              {attempts}
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
