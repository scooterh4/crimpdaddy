import React, { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  BoulderGradePyramidGraphData,
  ClimbLog,
  RouteGradePyramidGraphData,
} from "../../../../../static/types"
import { GraphColors } from "../../../../../static/styles"
import { Grid, useTheme } from "@mui/material"
import { useMediaQuery } from "@mui/material"
import {
  GYM_CLIMB_TYPES,
  GradePyramidFilter,
  PromiseTrackerArea,
} from "../../../../../static/constants"
import { assembleGradePyramidGraphData } from "../utils/data-helper-functions"
import { usePromiseTracker } from "react-promise-tracker"
import AppLoading from "../../../../common/loading"
import { CustomTooltip } from "./graph-tooltip"

type Props = {
  data: ClimbLog[]
  climbType: number
  tickFilter?: string
  dateFilter?: string
  climbTypeFilter?: string
}

export default function GradePyramid({
  data,
  climbType,
  tickFilter,
  dateFilter,
  climbTypeFilter,
}: Props) {
  const { promiseInProgress } = usePromiseTracker({
    area: PromiseTrackerArea.GradePyramidGraph,
  })
  const [graphData, setGraphData] = useState<
    BoulderGradePyramidGraphData[] | RouteGradePyramidGraphData[]
  >([])
  const theme = useTheme()
  const lgScreenAndUp = useMediaQuery(theme.breakpoints.up("lg"))
  const mdScreen = useMediaQuery(theme.breakpoints.only("md"))
  const graphAspectRatio = lgScreenAndUp ? 4 : mdScreen ? 3 : 2

  useEffect(() => {
    let formattedData = assembleGradePyramidGraphData(
      data,
      climbType,
      climbTypeFilter // should get climbTypeFilter or tickFilter, not both
        ? climbTypeFilter
        : tickFilter
        ? tickFilter
        : GradePyramidFilter.ClimbsAndAttempts,
      dateFilter
    )

    climbType === GYM_CLIMB_TYPES.Boulder
      ? setGraphData(formattedData as BoulderGradePyramidGraphData[])
      : setGraphData(formattedData as RouteGradePyramidGraphData[])
  }, [tickFilter, dateFilter, climbTypeFilter])

  if (promiseInProgress) {
    return (
      <Grid container direction={"column"} justifyContent={"center"}>
        <AppLoading />
      </Grid>
    )
  }
  return (
    <ResponsiveContainer aspect={graphAspectRatio}>
      <BarChart layout="vertical" data={graphData} barSize={30}>
        <XAxis type="number" allowDecimals={false} tickLine={false} />
        <YAxis
          type="category"
          tickCount={graphData.length}
          dataKey="grade"
          tickLine={false}
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
        <Bar dataKey="onsight" stackId="a" fill={GraphColors.Onsight} />
        <Bar dataKey="flash" stackId="a" fill={GraphColors.Flash} />
        <Bar dataKey="sends" stackId="a" fill={GraphColors.Sends} />
        <Bar dataKey="redpoint" stackId="a" fill={GraphColors.Redpoint} />
        <Bar dataKey="attempts" stackId="a" fill={GraphColors.Attempts} />
      </BarChart>
    </ResponsiveContainer>
  )
}
