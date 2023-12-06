import React from "react"
import { Grid, Typography } from "@mui/material"
import { AppFont } from "../../../../../static/styles"

type Props = {
  data: string
  climbType: string
}

export default function HardestGradeDisplay({ data, climbType }: Props) {
  const title = climbType === "TopRope" ? "Top Rope" : climbType

  return (
    <Grid container direction={"column"} gridAutoRows={"auto"}>
      <Typography
        gridRow={1}
        variant="h5"
        sx={{
          fontFamily: AppFont,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {!data || data === "" ? "--" : data}
      </Typography>
      <Typography gridRow={2} sx={{ fontFamily: AppFont, textAlign: "center" }}>
        {title}
      </Typography>
    </Grid>
  )
}
