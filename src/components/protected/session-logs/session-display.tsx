import { Grid, Typography } from "@mui/material"
import React from "react"
import { ThemeColors } from "../../../static/styles"
import { ClimbingSessionData } from "../../../static/types"
import moment from "moment"
import SessionGraph from "./session-graph"
import SessionStatDisplay from "./session-stat-display"

type Props = {
  data: ClimbingSessionData
}

export default function SessionDisplay({ data }: Props) {
  const metaData = data.sessionMetadata
  const sessionDuration = moment
    .unix(metaData.sessionEnd.seconds)
    .diff(moment.unix(metaData.sessionStart.seconds), "minutes")

  const statsToDisplay = [
    {
      title: "Duration",
      stat: `${Math.floor(sessionDuration / 60)}hr ${sessionDuration % 60}min`,
      // icon: <AccessTimeIcon />,
    },
    {
      title: "Successful Climbs",
      stat: `${metaData.numberOfBoulders + metaData.numberOfRoutes}`,
    },
    {
      title: "Failed Attempts",
      stat: `${metaData.failedAttempts}`,
    },
  ]

  if (metaData.hardestBoulderClimbed !== "") {
    statsToDisplay.push({
      title: "Hardest Boulder Climbed",
      stat: `${metaData.hardestBoulderClimbed}`,
    })
  }

  if (metaData.hardestRouteClimbed !== "") {
    statsToDisplay.push({
      title: "Hardest Route Climbed",
      stat: `${metaData.hardestRouteClimbed}`,
    })
  }

  return (
    <Grid
      alignItems={"center"}
      border={1}
      borderColor={ThemeColors.darkShade}
      borderRadius={2}
      container
      direction={"column"}
      gridAutoRows="auto"
      key={data.sessionMetadata.sessionStart.toString()}
      sx={{ backgroundColor: "white" }}
    >
      <Grid container direction={"column"} marginBottom={1}>
        <Typography
          marginTop={2}
          marginLeft={2}
          color={ThemeColors.darkShade}
          fontFamily={"poppins"}
          variant="h5"
        >
          {moment
            .unix(metaData.sessionStart.seconds)
            .format("MMM Do, YYYY")
            .toString()}
        </Typography>

        <Typography
          marginLeft={2}
          color={ThemeColors.darkShade}
          fontFamily={"poppins"}
          variant="h6"
        >
          {moment
            .unix(metaData.sessionStart.seconds)
            .format("h:mm a")
            .toString()}
        </Typography>

        <Grid
          container
          direction={"row"}
          justifyContent={"center"}
          marginTop={1}
          marginBottom={1}
        >
          {statsToDisplay.map((stat) => (
            <SessionStatDisplay
              key={stat.title}
              title={stat.title}
              stat={stat.stat}
            />
          ))}
        </Grid>
      </Grid>

      {data.sessionMetadata.numberOfBoulders > 0 && (
        <Grid container direction={"row"} justifyContent={"center"}>
          <Typography fontFamily={"poppins"} fontWeight={"bold"}>
            Bouldering
          </Typography>
          <SessionGraph climbType={"Boulder"} data={data} />
        </Grid>
      )}

      {data.sessionMetadata.numberOfRoutes > 0 && (
        <Grid container direction={"row"} justifyContent={"center"}>
          <Typography fontFamily={"poppins"} fontWeight={"bold"}>
            Routes
          </Typography>
          <SessionGraph climbType={"Routes"} data={data} />
        </Grid>
      )}
    </Grid>
  )
}
