import React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material"
import { GYM_CLIMB_TYPES } from "../../static/constants"

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
  function selectClimbType(climbType: number) {
    switch (climbType) {
      case GYM_CLIMB_TYPES.Boulder:
        setClimbType(GYM_CLIMB_TYPES.Boulder)
        break
      case GYM_CLIMB_TYPES.Lead:
        setClimbType(GYM_CLIMB_TYPES.Lead)
        break
      case GYM_CLIMB_TYPES.TopRope:
        setClimbType(GYM_CLIMB_TYPES.TopRope)
        break
    }

    handleSubmitClimbType()
  }

  return (
    <>
      <Dialog open={open}>
        <DialogTitle textAlign={"center"}>What kind of climb?</DialogTitle>
        <DialogContent sx={{ justifyContent: "center", alignItems: "center" }}>
          <Grid
            container
            direction="column"
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Grid item sm={4} xs={12}>
              <Button
                onClick={() => selectClimbType(GYM_CLIMB_TYPES.Boulder)}
                variant="contained"
                color="primary"
                type="submit"
                sx={{ marginTop: 2 }}
              >
                {GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.Boulder]}
              </Button>
            </Grid>
            <Grid item sm={4} xs={12}>
              <Button
                onClick={() => selectClimbType(GYM_CLIMB_TYPES.Lead)}
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  marginTop: 2,
                  marginLeft: 0,
                  marginRight: 0,
                }}
              >
                {GYM_CLIMB_TYPES[GYM_CLIMB_TYPES.Lead]}
              </Button>
            </Grid>
            <Grid item sm={4} xs={12}>
              <Button
                onClick={() => selectClimbType(GYM_CLIMB_TYPES.TopRope)}
                variant="contained"
                color="primary"
                type="submit"
                sx={{ marginTop: 2 }}
              >
                Top Rope
              </Button>
            </Grid>
          </Grid>
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
