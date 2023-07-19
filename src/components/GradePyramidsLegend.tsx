import React from "react"
import { Square } from "@mui/icons-material"
import { Card, Grid, Typography } from "@mui/material"
import { GraphColors } from "../static/styles"

const GradePyramidsLegend = () => {
  return (
    <>
      {/* <Card sx={{ display: "inline-flex" }}> */}
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

        <Grid item sx={{ display: "inline-flex" }}>
          <Square sx={{ color: GraphColors.Attempts }} />
          <Typography>Other</Typography>
        </Grid>
      </Grid>
      {/* </Card> */}
    </>
  )
}

export default GradePyramidsLegend
