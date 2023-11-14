import React from "react"
import { Square } from "@mui/icons-material"
import { Grid, Typography } from "@mui/material"
import { AppColors, GraphColors } from "../../../static/styles"
import { GYM_CLIMB_TYPES } from "../../../static/constants"

type Props = {
  section: string
  climbType?: number | undefined
}

export default function SectionLegend({ section, climbType }: Props) {
  return (
    <Grid
      container
      justifyContent={"center"}
      direction={"row"}
      spacing={2}
      sx={{ display: "inline-flex" }}
    >
      {(section === "activity" || section === "progression") && (
        <Grid item sx={{ display: "inline-flex" }}>
          <Square sx={{ color: AppColors.success }} />
          <Typography fontFamily={"poppins"}>Climbs</Typography>
        </Grid>
      )}

      {section === "gradePyramids" && climbType !== GYM_CLIMB_TYPES.Boulder && (
        <Grid item sx={{ display: "inline-flex" }}>
          <Square sx={{ color: GraphColors.Onsight }} />
          <Typography fontFamily={"poppins"}>Onsight</Typography>
        </Grid>
      )}

      {section === "gradePyramids" && (
        <Grid item sx={{ display: "inline-flex" }}>
          <Square sx={{ color: GraphColors.Flash }} />
          <Typography fontFamily={"poppins"}>Flash</Typography>
        </Grid>
      )}

      {section === "gradePyramids" && climbType !== GYM_CLIMB_TYPES.Boulder && (
        <Grid item sx={{ display: "inline-flex" }}>
          <Square sx={{ color: GraphColors.Redpoint }} />
          <Typography fontFamily={"poppins"}>Redpoint</Typography>
        </Grid>
      )}

      {section === "gradePyramids" && climbType === GYM_CLIMB_TYPES.Boulder && (
        <Grid item sx={{ display: "inline-flex" }}>
          <Square sx={{ color: GraphColors.Sends }} />
          <Typography fontFamily={"poppins"}>Sends</Typography>
        </Grid>
      )}

      <Grid item sx={{ display: "inline-flex" }}>
        <Square sx={{ color: GraphColors.Attempts }} />
        <Typography fontFamily={"poppins"}>Attempts</Typography>
      </Grid>
    </Grid>
  )
}
