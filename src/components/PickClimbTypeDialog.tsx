import React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import { CLIMB_TYPES, GYM_CLIMB_TYPES } from "../static/constants"

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
    setClimbType(CLIMB_TYPES.Boulder)
    handleSubmitClimbType()
  }

  function selectSport() {
    setClimbType(CLIMB_TYPES.Sport)
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
            {GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.Lead]}
          </Button>
          <Button
            onClick={selectSport}
            variant="contained"
            color="primary"
            type="submit"
            sx={{ marginTop: 2, marginLeft: 2, marginRight: 2 }}
          >
            Top Rope
          </Button>
          <Button
            onClick={selectBoulder}
            variant="contained"
            color="primary"
            type="submit"
            sx={{ marginTop: 2 }}
          >
            {GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.Boulder]}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button variant="text" color="error" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PickClimbType
