import React, { useState } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { CLIMB_TYPES } from "../constants"

enum ClimbType {
  Sport,
  Boulder,
}

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

export type ClimbTypeProps = {
  open: boolean
  handleClose: () => void
  setClimbType: React.Dispatch<React.SetStateAction<number>>
  handleSubmitClimbType: () => void
}

function PickClimbType({
  open,
  handleClose,
  setClimbType,
  handleSubmitClimbType,
}: ClimbTypeProps) {
  function selectBoulder() {
    setClimbType(ClimbType.Boulder)
    handleSubmitClimbType()
  }

  function selectSport() {
    setClimbType(ClimbType.Sport)
    handleSubmitClimbType()
  }

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>What kind of climb?</DialogTitle>
        <DialogContent>
          <Button
            onClick={selectSport}
            variant="contained"
            color="primary"
            type="submit"
            sx={{ marginTop: 2 }}
          >
            Lead
          </Button>
          <Button
            onClick={selectSport}
            variant="contained"
            color="primary"
            type="submit"
            sx={{ marginTop: 2, marginLeft: 2, marginRight: 2 }}
          >
            Top rope
          </Button>
          <Button
            onClick={selectBoulder}
            variant="contained"
            color="primary"
            type="submit"
            sx={{ marginTop: 2 }}
          >
            Boulder
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PickClimbType
