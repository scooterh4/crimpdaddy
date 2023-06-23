import React, { useState } from "react"
import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material"
import {
  ATTEMPT_TYPES,
  BOULDER_GRADES,
  INDOOR_SPORT_GRADES,
} from "../static/constants"

enum ClimbType {
  Sport,
  Boulder,
}

export type LogModalProps = {
  open: boolean
  handleClose: () => void
  climbType: number
}

function LogModal({ open, handleClose, climbType }: LogModalProps) {
  const [grade, setGrade] = useState("")
  const [attempt, setAttempt] = useState("")
  const grades =
    climbType === ClimbType.Sport ? INDOOR_SPORT_GRADES : BOULDER_GRADES

  function handleSubmit() {
    // event.preventDefault()
    console.log("Submitted!")
    console.log("Form data:", climbType, grade, attempt)
    handleClose()
    setGrade("")
    setAttempt("")
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        {/* <DialogTitle>What kind of climb?</DialogTitle> */}
        <DialogContent>
          {/* <form onSubmit={handleSubmit}> */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Grade</InputLabel>
            <Select value={grade} onChange={(e) => setGrade(e.target.value)}>
              {grades.map((grade, index) => (
                <MenuItem key={index} value={grade}>
                  {grade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Attempt</InputLabel>
            <Select
              value={attempt}
              onChange={(e) => setAttempt(e.target.value)}
            >
              {ATTEMPT_TYPES.map((attempt, index) => (
                <MenuItem key={index} value={attempt}>
                  {attempt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ marginTop: 2 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          {/* </form> */}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LogModal
