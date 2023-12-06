import { Grid, Typography } from "@mui/material"
import Divider from "@mui/material/Divider"
import React from "react"
import { AppFont, ThemeColors } from "../../../../../static/styles"
import { ClimbingSessionData } from "../../../../../static/types"
import moment from "moment"
import SessionStatDisplay from "./session-stat-display"
import SessionBoulderingGraphs from "./session-bouldering-graphs"
import SessionRouteGraphs from "./session-route-graphs"

type Props = {
  data: ClimbingSessionData
}

export default function SessionDisplay({ data }: Props) {
  const metaData = data.sessionMetadata
  const sessionDuration = moment
    .unix(metaData.sessionEnd.seconds)
    .diff(moment.unix(metaData.sessionStart.seconds), "minutes")
  const durationHours =
    Math.floor(sessionDuration / 60) === 0
      ? ""
      : `${Math.floor(sessionDuration / 60)}hr`

  const statsToDisplay = [
    {
      title: "Duration",
      stat: durationHours + `${sessionDuration % 60}min`,
    },
    {
      title: "Climbs",
      stat: `${metaData.numberOfBoulders + metaData.numberOfRoutes}`,
    },
    {
      title: "Attempts",
      stat: `${metaData.failedAttempts}`,
    },
  ]

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
      paddingBottom={2}
      sx={{ backgroundColor: "white" }}
    >
      <Grid container direction={"column"} marginBottom={2}>
        <Typography
          marginTop={2}
          marginLeft={2}
          color={ThemeColors.darkShade}
          fontFamily={AppFont}
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
          fontFamily={AppFont}
          variant="h6"
        >
          {moment
            .unix(metaData.sessionStart.seconds)
            .format("h:mm a")
            .toString()}
        </Typography>
      </Grid>

      <Grid container direction={"row"} justifyContent={"center"}>
        {statsToDisplay.map((stat, index) => (
          <Grid display={"flex"} key={index}>
            <SessionStatDisplay
              // key={stat.title}
              title={stat.title}
              stat={stat.stat}
            />
            {index < statsToDisplay.length - 1 ? (
              <Divider
                orientation="vertical"
                // variant="middle"
                flexItem
                sx={{ marginLeft: 2, marginRight: 2 }}
              />
            ) : null}
          </Grid>
        ))}
      </Grid>

      {data.sessionMetadata.numberOfBoulders > 0 && (
        <SessionBoulderingGraphs data={data} />
      )}

      {data.sessionMetadata.numberOfRoutes > 0 && (
        <SessionRouteGraphs data={data} />
      )}
    </Grid>
  )
}
