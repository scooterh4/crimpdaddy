import { Grid } from "@mui/material"
import React from "react"
import { ThemeColors } from "../../../static/styles"
import {
  ClimbingSessionData,
  SessionClimb,
  UserClimbingData,
} from "../../../static/types"
import moment from "moment"

type Props = {
  data: ClimbingSessionData
}

// sessionId: string
// hardestBoulderClimbed: string
// hardestRouteClimbed: string
// numberOfBoulders: number
// numberOfRoutes: number
// sessionStart: Timestamp

export default function SessionDisplay({ data }: Props) {
  const metaData = data.sessionMetadata
  const logs = data.climbs

  return (
    <Grid
      alignItems={"center"}
      border={1}
      borderColor={ThemeColors.darkShade}
      borderRadius={2}
      container
      direction={"column"}
      gridAutoRows="auto"
      sx={{ backgroundColor: "white" }}
    >
      <p>
        Session start:{" "}
        {moment
          .unix(metaData.sessionStart.seconds)
          .format("MMM Do YYYY, h:mm:ss a")
          .toString()}
      </p>
      <p>Number of boulders: {metaData.numberOfBoulders}</p>
      <p>Number of routes: {metaData.numberOfRoutes}</p>
      <p>Hardest boulder climbed: {metaData.hardestBoulderClimbed}</p>
      <p>Hardest route climbed: {metaData.hardestRouteClimbed}</p>
    </Grid>
  )
}
