import React from "react"
import testGif from "../../../../../images/IMG_7098.gif"
import anotherGif from "../../../../../images/IMG_7098 (1).gif"
import adobeGif from "../../../../../images/IMG_7098 (2).gif"
import { Grid } from "@mui/material"

export default function GifDisplay() {
  return (
    <Grid container>
      <img
        src={anotherGif}
        alt="Test"
        style={{ borderRadius: 10, maxHeight: "500px" }}
      />

      <img
        src={adobeGif}
        alt="Test"
        style={{ borderRadius: 10, maxHeight: "500px" }}
      />
    </Grid>
  )
}
