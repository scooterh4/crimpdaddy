import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import React, { useCallback, useEffect, useRef } from "react"
import {
  useNavigate,
  unstable_useBlocker as useBlocker,
  useBeforeUnload,
} from "react-router-dom"
import { AppColors, ThemeColors } from "../../static/styles"

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  confirmRoute: string
}

// function usePrompt(
//   onLocationChange: CallableFunction,
//   hasUnsavedChanges: boolean
// ) {
//   const blocker = useBlocker(true)
//   const prevState = useRef(blocker.state)

//   useEffect(() => {
//     if (blocker.state === "blocked") {
//       blocker.reset()
//     }
//     prevState.current = blocker.state
//   }, [blocker])
// }

// function FormPrompt(hasUnsavedChanges: boolean) {
//   const onLocationChange = useCallback(() => {
//     return !window.confirm(
//       "You have unsaved changes, are you sure you want to leave?"
//     )
//   }, [hasUnsavedChanges])

//   usePrompt(onLocationChange, hasUnsavedChanges)
//   useBeforeUnload(
//     useCallback(
//       (event) => {
//         if (hasUnsavedChanges) {
//           event.preventDefault()
//           event.returnValue = ""
//         }
//       },
//       [hasUnsavedChanges]
//     ),
//     { capture: true }
//   )

//   return null
// }

export function ConfirmDialog({ open, setOpen, confirmRoute }: Props) {
  const navigate = useNavigate()
  const hasUnsavedChanges = true

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = () => {
    // const confirm = window.confirm(
    //   "You have unsaved changes, are you sure you want to leave?"
    // )
    // if (confirm) {
    navigate(confirmRoute)
    // }
  }

  return (
    <Dialog
      open={open ? open : false}
      onClose={handleClose}
      sx={{ fontFamily: "poppins" }}
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
