import React from "react"
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import { AppFont } from "../../../../../static/styles"

type Props = {
  title: string
  stat: string
}

export default function SessionStatDisplay({ title, stat }: Props) {
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  return (
    <Grid
      // container
      item
      // direction={"column"}
      gridAutoRows={"auto"}
      alignItems={"center"}
      // display={"flex"}
    >
      <Typography
        gridRow={1}
        variant={xsScreen ? "body2" : "subtitle1"}
        sx={{
          fontFamily: AppFont,
          textAlign: "center",
        }}
      >
        {title}
      </Typography>
      <Typography
        gridRow={2}
        variant={xsScreen ? "subtitle2" : "h5"}
        sx={{
          fontFamily: AppFont,
          textAlign: "center",
          fontWeight: xsScreen ? "bold" : "",
        }}
      >
        {stat}
      </Typography>
    </Grid>
  )
}
