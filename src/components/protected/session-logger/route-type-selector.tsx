import { Button, FormControl, FormHelperText, Grid } from "@mui/material"
import React from "react"
import { GYM_CLIMB_TYPES } from "../../../static/constants"
import { AppColors, ThemeColors } from "../../../static/styles"

type Props = {
  routeClimbType: string
  setRouteClimbType: React.Dispatch<React.SetStateAction<string>>
}

export default function RouteTypeSelector({
  routeClimbType,
  setRouteClimbType,
}: Props) {
  return (
    <Grid container direction={"row"} marginBottom={2}>
      <Button
        onClick={() => setRouteClimbType(GYM_CLIMB_TYPES[1])}
        sx={{
          backgroundColor:
            routeClimbType === GYM_CLIMB_TYPES[1]
              ? ThemeColors.darkAccent
              : AppColors.primary,
          color: "white",
          ":hover": {
            backgroundColor: ThemeColors.darkAccent,
            color: "white",
          },
          textTransform: "none",
        }}
      >
        Lead
      </Button>
      <Button
        onClick={() => setRouteClimbType(GYM_CLIMB_TYPES[2])}
        sx={{
          backgroundColor:
            routeClimbType === GYM_CLIMB_TYPES[2]
              ? ThemeColors.darkAccent
              : AppColors.primary,
          ":hover": {
            backgroundColor: ThemeColors.darkAccent,
            color: "white",
          },
          color: "white",
          textTransform: "none",
          marginLeft: 1,
        }}
      >
        Top rope
      </Button>
    </Grid>
  )
}
