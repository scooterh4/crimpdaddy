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
import { useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import { GraphColors } from "../../../../../static/styles"
import AppLoading from "../../../../common/loading"
import { ClimbLog } from "../../../../../static/types"
import { PromiseTrackerArea } from "../../../../../static/constants"
import { usePromiseTracker } from "react-promise-tracker"
import { CustomTooltip } from "./graph-tooltip"
import { filterRawClimbingData } from "../utils/data-helper-functions"

type Props = {
  data: ClimbLog[]
  filter: string
}

export type ClimbsByDate = {
  climbs: number
  attempts: number
  date: string
  timestamp: number
}

export default function ActivityGraph({ filter, data }: Props) {
  const { promiseInProgress } = usePromiseTracker({
    area: PromiseTrackerArea.Activity,
  })
  const [graphData, setGraphData] = useState<ClimbsByDate[]>([])
  const [graphMaxRange, setGraphMaxRange] = useState<number>(15)

  const theme = useTheme()
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const smScreenOnly = useMediaQuery(theme.breakpoints.only("sm"))
  const graphAspectRatio = mdScreenAndUp ? 4 : smScreenOnly ? 2 : 1.1

  // sets the graph data from the initial data passed in by the dashboard
  useEffect(() => {
    if (data) {
      const res = filterRawClimbingData(data, filter)
      setGraphMaxRange(res.yAxisRange + 2 < 9 ? 9 : res.yAxisRange + 2)
      setGraphData(res.result)
    }
  }, [filter])

  useEffect(() => {
    if (data && data.length > 0) {
      const res = filterRawClimbingData(data, filter)
      setGraphMaxRange(res.yAxisRange + 2 < 9 ? 9 : res.yAxisRange + 2)
      setGraphData(res.result)
    }
  }, [data])

  if (promiseInProgress) {
    return <AppLoading />
  }

  return (
    <ResponsiveContainer aspect={graphAspectRatio}>
      <BarChart
        data={graphData}
        margin={{
          top: 20,
          right: 10,
          left: -20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="category" dataKey="date" />
        <YAxis
          type="number"
          dataKey="attempts"
          domain={[0, graphMaxRange]}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="climbs" stackId="a" fill={GraphColors.Sends} />
        <Bar dataKey="attempts" stackId="a" fill={GraphColors.Attempts} />
      </BarChart>
    </ResponsiveContainer>
  )
}
