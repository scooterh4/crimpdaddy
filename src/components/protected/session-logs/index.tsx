import { Grid, Typography } from "@mui/material"
import React from "react"
import { ThemeColors } from "../../../static/styles"
import { useUserContext } from "../protected-context"
import SessionDisplay from "./session-display"

export default function SessionLogsPage() {
  const { userSessions } = useUserContext()

  if (!userSessions) {
    return (
      <>
        <Typography
          color={ThemeColors.darkShade}
          fontFamily={"poppins"}
          gutterBottom
          marginTop={2}
          variant="h3"
        >
          Sessions
        </Typography>
        <Typography>No sessions *wamp*</Typography>
      </>
    )
  }
  return (
    <>
      <Typography
        color={ThemeColors.darkShade}
        fontFamily={"poppins"}
        gutterBottom
        marginTop={2}
        variant="h3"
      >
        Sessions
      </Typography>
      {userSessions &&
        userSessions.map((session, index) => (
          <Grid
            container
            direction={"row"}
            key={index}
            marginTop={2}
            marginBottom={2}
          >
            <SessionDisplay data={session} />
          </Grid>
        ))}
    </>
  )
}
