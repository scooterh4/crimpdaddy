import { Grid, Typography } from "@mui/material"
import React from "react"
import { ThemeColors } from "../../../static/styles"
import {
  ClimbingSessionData,
  SessionClimb,
  UserClimbingData,
} from "../../../static/types"
import moment from "moment"
import SessionGraph from "./session-graph"

type Props = {
  data: ClimbingSessionData
}

export default function SessionDisplay({ data }: Props) {
  const metaData = data.sessionMetadata

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
      <Grid container direction={"row"}>
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
      {data.sessionMetadata.numberOfBoulders > 0 && (
        <Grid container direction={"row"} justifyContent={"center"}>
          <Typography fontFamily={"poppins"} fontWeight={"bold"}>
            Bouldering
          </Typography>
          <SessionGraph climbType={"Boulder"} data={data.climbs} />
        </Grid>
      )}
      {data.sessionMetadata.numberOfRoutes > 0 && (
        <Grid container direction={"row"} justifyContent={"center"}>
          <Typography fontFamily={"poppins"} fontWeight={"bold"}>
            Routes
          </Typography>
          <SessionGraph climbType={"Routes"} data={data.climbs} />
        </Grid>
      )}
    </Grid>
  )
}
