import React from "react"
import { GYM_CLIMB_TYPES } from "../../../../../static/constants"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { AppColors, AppFont, ThemeColors } from "../../../../../static/styles"
import {
  useClimbToDeleteContext,
  useDeleteClimbDialogVisibilityContext,
  useSessionAPI,
} from "../context/session-logger-context"
import { SessionClimb } from "../../../../../static/types"

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  climb: SessionClimb | null
  index: number | null
}

export default function ConfirmDeleteClimbDialog() {
  const open = useDeleteClimbDialogVisibilityContext()
  const climbToDelete = useClimbToDeleteContext()
  const { onRemoveClimb, onCloseDeleteClimbDialog } = useSessionAPI()

  const handleClose = () => {
    onCloseDeleteClimbDialog()
  }

  const handleConfirm = () => {
    onRemoveClimb(
      climbToDelete.climb.climbType === GYM_CLIMB_TYPES[0]
        ? GYM_CLIMB_TYPES.Boulder
        : 1,
      climbToDelete.index
    )
  }

  return (
    <Dialog
      open={open ? open : false}
      onClose={handleClose}
      sx={{ fontFamily: AppFont }}
    >
      <DialogTitle
        color={"white"}
        id="alert-dialog-title"
        fontWeight={"bold"}
        sx={{ backgroundColor: AppColors.danger }}
      >
        {"Delete climb?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" marginTop={3}>
          {climbToDelete && climbToDelete.climb && (
            <p>
              Are you sure you want to delete the following climb:
              <br />
              <b>
                {climbToDelete.climb.grade} {climbToDelete.climb.tick}
              </b>
            </p>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ backgroundColor: "white", color: AppColors.danger }}
        >
          No
        </Button>
        <Button
          onClick={handleConfirm}
          autoFocus
          sx={{ backgroundColor: "white", color: AppColors.danger }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
