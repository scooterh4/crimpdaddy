import { Grid } from "@mui/material"
import React from "react"
import ReactLoading from "react-loading"
import { ThemeColors } from "../../static/styles"

export default function AppLoading() {
  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      direction="row"
      marginTop={8}
      sx={{ height: "100%" }}
    >
      <ReactLoading
        type="spin"
        color={ThemeColors.darkAccent}
        height={200}
        width={100}
      />
    </Grid>
  )
}
