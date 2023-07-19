import React, { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ClimbLog, MonthlyClimbData } from "../static/types"
import { Card, Typography, useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"

export type MonthlyClimbsGraphProps = {
  climbingData: ClimbLog[]
}

function MonthlyClimbsGraph({ climbingData }: MonthlyClimbsGraphProps) {
  const [graphData, setGraphData] = useState<MonthlyClimbData[]>([])
  const theme = useTheme()
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const graphWidth = mdScreenAndUp ? 800 : 300
  const graphAspectRatio = mdScreenAndUp ? 3 : 1.5

  useEffect(() => {
    if (climbingData.length > 0) {
      let result: MonthlyClimbData[] = [
        { month: "Jan", numberOfClimbs: 0 },
        { month: "Feb", numberOfClimbs: 0 },
        { month: "Mar", numberOfClimbs: 0 },
        { month: "Apr", numberOfClimbs: 0 },
        { month: "May", numberOfClimbs: 0 },
        { month: "Jun", numberOfClimbs: 0 },
        { month: "Jul", numberOfClimbs: 0 },
        { month: "Aug", numberOfClimbs: 0 },
        { month: "Sep", numberOfClimbs: 0 },
        { month: "Oct", numberOfClimbs: 0 },
        { month: "Nov", numberOfClimbs: 0 },
        { month: "Dec", numberOfClimbs: 0 },
      ]

      climbingData.forEach((climb) => {
        result.find(
          (m) =>
            m.month ===
            climb.DateTime.toDate().toLocaleString("default", {
              month: "short",
            })
        )!.numberOfClimbs += climb.Attempts
      })

      setGraphData(result)
    }
  }, [climbingData])

  return (
    <Card
      sx={{ paddingTop: 2, paddingRight: 2, borderRadius: 5, height: "100%" }}
    >
      <Typography variant="h5" align="center">
        Climbs by Month
      </Typography>
      <ResponsiveContainer width={graphWidth} aspect={graphAspectRatio}>
        <AreaChart margin={{ left: -15 }} data={graphData} barSize={50}>
          <defs>
            <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C6B4B0" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#C6B4B0" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis type="category" dataKey="month" />
          <YAxis
            type="number"
            dataKey="numberOfClimbs"
            tickLine={false}
            fontSize={12}
          />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="numberOfClimbs"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorAttempts)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default MonthlyClimbsGraph
