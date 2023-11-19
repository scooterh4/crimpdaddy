import React, { useEffect, useState } from "react"
import { Grid, Typography } from "@mui/material"
import { UserIndoorRedpointGradesDoc } from "../../../static/types"

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
          fontFamily: "poppins",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {data}
      </Typography>
      <Typography
        gridRow={2}
        sx={{ fontFamily: "poppins", textAlign: "center" }}
      >
        {title}
      </Typography>
    </Grid>
  )
}
