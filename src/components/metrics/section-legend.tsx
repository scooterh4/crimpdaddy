import React from "react"
import { Square } from "@mui/icons-material"
import { Grid, Typography } from "@mui/material"
import { GraphColors } from "../../styles/styles"

type Props = {
  section: string
}

export default function SectionLegend({ section }: Props) {
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
            <Typography fontFamily={"poppins"}>Climbs</Typography>
          </Grid>

          <Grid item sx={{ display: "inline-flex" }}>
            <Square sx={{ color: GraphColors.Attempts }} />
            <Typography fontFamily={"poppins"}>Attempts</Typography>
          </Grid>
        </Grid>
      </>
    )
  }

  return (
    <Grid
      container
      justifyContent={"center"}
      direction={"row"}
      spacing={2}
      sx={{ display: "inline-flex" }}
    >
      <Grid item sx={{ display: "inline-flex" }}>
        <Square sx={{ color: GraphColors.Onsight }} />
        <Typography fontFamily={"poppins"}>Onsight</Typography>
      </Grid>

      <Grid item sx={{ display: "inline-flex" }}>
        <Square sx={{ color: GraphColors.Flash }} />
        <Typography fontFamily={"poppins"}>Flash</Typography>
      </Grid>

      <Grid item sx={{ display: "inline-flex" }}>
        <Square sx={{ color: GraphColors.Redpoint }} />
        <Typography fontFamily={"poppins"}>Redpoint</Typography>
      </Grid>

      {section === "gradePyramids" && (
        <Grid item sx={{ display: "inline-flex" }}>
          <Square sx={{ color: GraphColors.Attempts }} />
          <Typography fontFamily={"poppins"}>Attempts</Typography>
        </Grid>
      )}
    </Grid>
  )
}
