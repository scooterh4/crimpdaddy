import { Grid, Typography } from "@mui/material"
import React from "react"
import GradePyramid from "../grade-pyramids/grade-pyramid-graph"
import SessionGraph from "./session-graph"
import { GYM_CLIMB_TYPES } from "../../../static/constants"
import { ClimbingSessionData } from "../../../static/types"

type Props = {
  data: ClimbingSessionData
}

export default function SessionBoulderingGraphs({ data }: Props) {
  return (
    <Grid container direction={"column"}>
      <Typography
        fontFamily={"poppins"}
        marginLeft={2}
        marginRight={2}
        variant="h6"
      >
        Bouldering
      </Typography>

      <Grid container direction={"row"} alignItems={"center"}>
        <Grid
          direction={"column"}
          container
          item
          marginLeft={-2}
          xs={12}
          sm={6}
        >
          <Typography
            fontFamily={"poppins"}
            marginLeft={2}
            marginRight={2}
            variant="subtitle1"
            textAlign={"center"}
          >
            Grades
          </Typography>

          <GradePyramid
            climbType={GYM_CLIMB_TYPES.Boulder}
            sessionData={data.climbs}
          />
        </Grid>

        <Grid
          container
          direction={"column"}
          item
          marginLeft={-1}
          xs={12}
          sm={6}
        >
          <Typography
            fontFamily={"poppins"}
            marginLeft={2}
            marginRight={2}
            variant="subtitle1"
            textAlign={"center"}
          >
            Activity
          </Typography>

          <SessionGraph climbType={"Boulder"} data={data} />
        </Grid>
      </Grid>
    </Grid>
  )
}
