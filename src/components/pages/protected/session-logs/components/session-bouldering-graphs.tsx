import { Grid, Typography } from "@mui/material"
import React from "react"
import GradePyramid from "../../grade-pyramids/components/grade-pyramid-graph"
import { GYM_CLIMB_TYPES } from "../../../../../static/constants"
import { ClimbingSessionData } from "../../../../../static/types"
import SectionLegend from "../../common/section-legend"

type Props = {
  data: ClimbingSessionData
}

export default function SessionBoulderingGraphs({ data }: Props) {
  return (
    <Grid container direction={"column"} marginTop={2}>
      <Typography
        fontFamily={"poppins"}
        marginLeft={2}
        marginRight={2}
        variant="h6"
      >
        Bouldering
      </Typography>

      <Grid item marginLeft={-3} paddingRight={2}>
        <GradePyramid data={data.climbs} climbType={GYM_CLIMB_TYPES.Boulder} />
      </Grid>

      <Grid item>
        <SectionLegend
          section={"gradePyramids"}
          climbType={GYM_CLIMB_TYPES.Boulder}
        />
      </Grid>
    </Grid>
  )
}
