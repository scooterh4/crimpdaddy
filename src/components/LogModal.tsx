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

const climbTypes = ["Boulder", "Lead", "Top Rope"]
const boulderGrades = [
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
]
const attempts = ["Onsight", "Flash", "Redpoint", "Hang", "Failed"]

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
                {climbTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Grade</InputLabel>
              <Select value={grade} onChange={(e) => setGrade(e.target.value)}>
                {boulderGrades.map((grade, index) => (
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
                {attempts.map((attempt, index) => (
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
