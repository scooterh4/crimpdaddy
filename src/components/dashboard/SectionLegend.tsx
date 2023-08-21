import React from "react"
import { Square } from "@mui/icons-material"
import { Grid, Typography } from "@mui/material"
import { GraphColors } from "../../static/styles"

export type SectionLegendProps = {
  section: string
}

function SectionLegend({ section }: SectionLegendProps) {
  if (section === "activity") {
    return (
      <>
        <Grid
          container
          justifyContent={"center"}
          direction={"row"}
          spacing={2}
          sx={{ display: "inline-flex" }}
        >
          <Grid item sx={{ display: "inline-flex" }}>
            <Square sx={{ color: GraphColors.Climbs }} />
            <Typography>Sends</Typography>
          </Grid>

          <Grid item sx={{ display: "inline-flex" }}>
            <Square sx={{ color: GraphColors.Attempts }} />
            <Typography>Attempts</Typography>
          </Grid>
        </Grid>
      </>
    )
  }

  return (
    <>
      <Grid
        container
        justifyContent={"center"}
        direction={"row"}
        spacing={2}
        sx={{ display: "inline-flex" }}
      >
        <Grid item sx={{ display: "inline-flex" }}>
          <Square sx={{ color: GraphColors.Onsight }} />
          <Typography>Onsight</Typography>
        </Grid>

        <Grid item sx={{ display: "inline-flex" }}>
          <Square sx={{ color: GraphColors.Flash }} />
          <Typography>Flash</Typography>
        </Grid>

        <Grid item sx={{ display: "inline-flex" }}>
          <Square sx={{ color: GraphColors.Redpoint }} />
          <Typography>Redpoint</Typography>
        </Grid>

        {section === "gradePyramids" && (
          <Grid item sx={{ display: "inline-flex" }}>
            <Square sx={{ color: GraphColors.Attempts }} />
            <Typography>Attempts</Typography>
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default SectionLegend
