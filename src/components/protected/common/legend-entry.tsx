import { Square } from "@mui/icons-material"
import { Grid, Typography } from "@mui/material"
import React from "react"

type Props = {
  title: string
  color: string
  display: string
}

export default function LegendEntry({ title, color, display }: Props) {
  return (
    <Grid item sx={{ display: display }}>
      <Square sx={{ color: color }} />
      <Typography fontFamily={"poppins"}>{title}</Typography>
    </Grid>
  )
}
