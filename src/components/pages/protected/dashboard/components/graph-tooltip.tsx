import React from "react"
import { TooltipProps } from "recharts"
import { Card, Grid, Typography } from "@mui/material"
import { AppFont, GraphColors } from "../../../../../static/styles"
import { Square } from "@mui/icons-material"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload) {
    return (
      <Card>
        <p>--</p>
      </Card>
    )
  }

  const climbs = payload.find((p) => p.dataKey === "climbs")
  const attempts = payload.find((p) => p.dataKey === "attempts")

  return (
    <Card sx={{ fontFamily: AppFont, padding: 2 }}>
      <Typography
        component="div"
        fontWeight={"bold"}
        gutterBottom
        textAlign={"center"}
      >
        {payload[0].payload.date}
      </Typography>

      {!climbs ||
        !attempts ||
        (climbs.value === 0 && attempts.value === 0 ? (
          <Typography component="div" textAlign={"center"}>
            --
          </Typography>
        ) : (
          <>
            <Grid
              container
              direction={"row"}
              item
              justifyContent={"center"}
              sx={{ display: "flex" }}
            >
              <Square sx={{ color: GraphColors.Sends }} />
              <Typography component="div">
                Climbs: <b>{climbs.value}</b>
              </Typography>
            </Grid>

            <Grid
              container
              direction={"row"}
              item
              justifyContent={"center"}
              sx={{ display: "flex" }}
            >
              <Square sx={{ color: GraphColors.Attempts }} />
              <Typography component="div">
                Attempts: <b>{attempts.value}</b>
              </Typography>
            </Grid>
          </>
        ))}
    </Card>
  )
}
