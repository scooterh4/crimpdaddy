import { Grid, Typography } from "@mui/material"
import React, { useState } from "react"
import GradePyramid from "../grade-pyramids/grade-pyramid-graph"
import { GYM_CLIMB_TYPES, GradePyramidFilter } from "../../../static/constants"
import { ClimbingSessionData } from "../../../static/types"
import SelectFilter from "../common/select-filter"
import SectionLegend from "../common/section-legend"

type Props = {
  data: ClimbingSessionData
}

export default function SessionRouteGraphs({ data }: Props) {
  const [gradePyramidFilter, setGradePyramidFilter] = useState<string>(
    GradePyramidFilter.AllRoutes
  )

  return (
    <Grid container direction={"column"} marginTop={2}>
      <Typography
        fontFamily={"poppins"}
        marginLeft={2}
        marginRight={2}
        variant="h6"
      >
        Routes
      </Typography>

      <Grid item marginLeft={1}>
        <SelectFilter
          graph={"sessionGradePyramid"}
          dateFilter={false}
          setFilter={setGradePyramidFilter}
        />
      </Grid>

      <Grid item marginLeft={-3} paddingRight={2}>
        <GradePyramid
          climbType={GYM_CLIMB_TYPES.Lead}
          sessionData={data.climbs}
          climbTypeFilter={gradePyramidFilter}
        />
      </Grid>

      <Grid item>
        <SectionLegend section={"gradePyramids"} />
      </Grid>
    </Grid>
  )
}
