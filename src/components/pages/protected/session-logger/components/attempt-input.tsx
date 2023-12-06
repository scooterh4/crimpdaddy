import { FormControl, TextField } from "@mui/material"
import React from "react"

type Props = {
  attemptCount: number | string
  setAttemptCount: React.Dispatch<React.SetStateAction<string | number>>
}

export default function AttemptInput({ attemptCount, setAttemptCount }: Props) {
  return (
    <FormControl fullWidth sx={{ marginTop: 5 }}>
      <TextField
        label={"Number of failed attempts"}
        InputProps={{
          inputProps: { min: 1 },
        }}
        onChange={(e) => {
          // dont allow anything less than zero or more than 100
          const returnValue = parseInt(e.target.value)
            ? parseInt(e.target.value) < 1 || parseInt(e.target.value) > 100
              ? ""
              : parseInt(e.target.value)
            : ""

          setAttemptCount(returnValue)
        }}
        type="number"
        value={attemptCount}
        variant="outlined"
        sx={{ backgroundColor: "white" }}
      >
        {attemptCount}
      </TextField>
    </FormControl>
  )
}
