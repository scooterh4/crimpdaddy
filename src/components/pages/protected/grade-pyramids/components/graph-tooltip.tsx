import React from "react"
import { TooltipProps } from "recharts"
import { AppFont, GraphColors } from "../../../../../static/styles"
import { Card, Grid, Typography } from "@mui/material"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"
import { Square } from "@mui/icons-material"

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

  const onsight = payload.find((p) => p.dataKey === "onsight")
  const flash = payload.find((p) => p.dataKey === "flash")
  const redpoint = payload.find((p) => p.dataKey === "redpoint")
  const sends = payload.find((p) => p.dataKey === "sends")
  const attempts = payload.find((p) => p.dataKey === "attempts")

  return (
    <Card sx={{ fontFamily: AppFont, padding: 2 }}>
      <Typography
        component="div"
        fontWeight={"bold"}
        gutterBottom
        textAlign={"center"}
      >
        {label}
      </Typography>

      {onsight && (
        <Grid
          container
          direction={"row"}
          item
          justifyContent={"center"}
          sx={{ display: "flex" }}
        >
          <Square sx={{ color: GraphColors.Onsight }} />
          <Typography component="div">
            Onsight: <b>{onsight.value}</b>
          </Typography>
        </Grid>
      )}

      {flash && (
        <Grid
          container
          direction={"row"}
          item
          justifyContent={"center"}
          sx={{ display: "flex" }}
        >
          <Square sx={{ color: GraphColors.Flash }} />
          <Typography component="div">
            Flash: <b>{flash.value}</b>
          </Typography>
        </Grid>
      )}

      {redpoint && (
        <Grid
          container
          direction={"row"}
          item
          justifyContent={"center"}
          sx={{ display: "flex" }}
        >
          <Square sx={{ color: GraphColors.Redpoint }} />
          <Typography component="div">
            Redpoint: <b>{redpoint.value}</b>
          </Typography>
        </Grid>
      )}

      {sends && (
        <Grid
          container
          direction={"row"}
          item
          justifyContent={"center"}
          sx={{ display: "flex" }}
        >
          <Square sx={{ color: GraphColors.Sends }} />
          <Typography component="div">
            Sends: <b>{sends.value}</b>
          </Typography>
        </Grid>
      )}

      {attempts && (
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
      )}
    </Card>
  )
}
