import { Grid } from "@mui/material"
import React from "react"
import ReactLoading from "react-loading"
import { ThemeColors } from "../../static/styles"

function AppLoading() {
  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      direction="row"
      sx={{ height: "100vh" }}
    >
      <Grid item>
        <ReactLoading
          type="spin"
          color={ThemeColors.darkAccent}
          height={200}
          width={100}
        />
      </Grid>
    </Grid>
  )
}

export default AppLoading
