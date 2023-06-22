import React, { useState } from "react"
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material"
import { ATTEMPT_TYPES, BOULDER_GRADES, CLIMB_TYPES } from "../constants"

const style = {
  position: "absolute" as "absolute",
  borderRadius: 6,
  color: "black",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
}

export type LogModalProps = {
  open: boolean
  handleClose: () => void
}

function LogModal({ open, handleClose }: LogModalProps) {
  const [climbType, setClimbType] = useState("")
  const [grade, setGrade] = useState("")
  const [attempt, setAttempt] = useState("")

  function handleSubmit() {
    // event.preventDefault()
    console.log("Submitted!")
    console.log("Form data:", climbType, grade, attempt)
    handleClose()
    setClimbType("")
    setGrade("")
    setAttempt("")
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Climb Type</InputLabel>
              <Select
                value={climbType}
                onChange={(e) => setClimbType(e.target.value)}
              >
                {CLIMB_TYPES.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Grade</InputLabel>
              <Select value={grade} onChange={(e) => setGrade(e.target.value)}>
                {BOULDER_GRADES.map((grade, index) => (
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
            >
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  )
}

export default LogModal
