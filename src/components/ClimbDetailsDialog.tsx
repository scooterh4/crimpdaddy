import React, { useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import {
  TICK_TYPES,
  BOULDER_GRADES,
  INDOOR_SPORT_GRADES,
  CLIMB_TYPES,
} from "../static/constants"
export type LogModalProps = {
  open: boolean
  handleClose: () => void
  climbType: number
}

function LogModal({ open, handleClose, climbType }: LogModalProps) {
  const [grade, setGrade] = useState("")
  const [tick, setTick] = useState("")
  const [attempts, setAttempts] = useState<number | string>("")
  const grades =
    climbType === CLIMB_TYPES.Boulder ? BOULDER_GRADES : INDOOR_SPORT_GRADES

  function handleSubmit() {
    // event.preventDefault()
    console.log("Submitted!")
    console.log("Form data:", climbType, grade, tick, attempts)
    handleClose()
    setGrade("")
    setTick("")
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <FormControl fullWidth margin="normal">
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
          </FormControl>
          <FormControl fullWidth margin="normal">
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
            >
              {attempts}
            </TextField>
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
          <Button variant="text" color="error" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LogModal
