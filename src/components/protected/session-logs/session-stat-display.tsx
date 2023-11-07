import { Card, Grid, Typography } from "@mui/material"
import React from "react"

type Props = {
  title: string
  stat: string
}

export default function SessionStatDisplay({ title, stat }: Props) {
  return (
    <Card sx={{ padding: 1, margin: 1 }}>
      <Grid
        container
        direction={"column"}
        gridAutoRows={"auto"}
        alignItems={"center"}
      >
        <Typography
          gridRow={2}
          variant="h5"
          sx={{
            fontFamily: "poppins",
            textAlign: "center",
          }}
        >
          {stat}
        </Typography>
        <Typography
          gridRow={1}
          sx={{
            fontFamily: "poppins",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {title}
        </Typography>
      </Grid>
    </Card>
  )
}
