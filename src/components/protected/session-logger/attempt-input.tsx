import { FormControl, FormHelperText, TextField } from "@mui/material"
import React from "react"
import { AppColors } from "../../../static/styles"

type Props = {
  attemptCount: number | string
  setAttemptCount: React.Dispatch<React.SetStateAction<string | number>>
  attemptError: boolean
}

export default function AttemptInput({
  attemptCount,
  setAttemptCount,
  attemptError,
}: Props) {
  return (
    <FormControl fullWidth sx={{ marginTop: 5 }}>
      <TextField
        error={attemptError}
        label={"Number of failed attempts"}
        onChange={(e) =>
          setAttemptCount(e.target.value !== "" ? parseInt(e.target.value) : "")
        }
        type="number"
        value={attemptCount}
        variant="outlined"
        sx={{ backgroundColor: "white" }}
      >
        {attemptCount}
      </TextField>
      {attemptError && (
        <FormHelperText sx={{ color: AppColors.danger }}>
          This is required!
        </FormHelperText>
      )}
    </FormControl>
  )
}
