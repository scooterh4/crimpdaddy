import React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { AppColors, AppFont, ThemeColors } from "../../static/styles"

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  confirmRoute: string
}

export function ConfirmDialog({ open, setOpen, confirmRoute }: Props) {
  const navigate = useNavigate()
  const handleClose = () => {
    setOpen(false)
  }
  const handleConfirm = () => {
    navigate(confirmRoute)
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
        {"Cancel session?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" marginTop={3}>
          By leaving this page, your session data will be lost. Are you sure you
          want to leave?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ backgroundColor: ThemeColors.darkAccent, color: "white" }}
        >
          No
        </Button>
        <Button
          onClick={handleConfirm}
          autoFocus
          sx={{ color: AppColors.danger }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
