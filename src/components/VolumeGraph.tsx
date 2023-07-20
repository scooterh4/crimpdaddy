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
import moment from "moment"

export type MonthlyClimbsGraphProps = {
  climbingData: ClimbLog[]
}

export type ClimbsByDate = {
  Date: string
  Attempts: number
}

function MonthlyClimbsGraph({ climbingData }: MonthlyClimbsGraphProps) {
  const [graphData, setGraphData] = useState<ClimbsByDate[]>([])

  const theme = useTheme()
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  const graphWidth = mdScreenAndUp ? 700 : xsScreen ? 350 : 500
  const graphAspectRatio = mdScreenAndUp ? 2.1 : xsScreen ? 1.3 : 2

  useEffect(() => {
    if (climbingData.length > 0) {
      let result: ClimbsByDate[] = []

      climbingData.forEach((climb) => {
        const date = moment(climb.DateTime.toDate())
          .format("MMM D, YYYY")
          .toString()
        const dateAlreadyAdded = result.find((r) => r.Date === date)

        if (dateAlreadyAdded) {
          dateAlreadyAdded.Attempts += climb.Attempts
        } else {
          result.push({
            Date: date,
            Attempts: climb.Attempts,
          })
        }
      })

      setGraphData(result)
    }
  }, [climbingData])

  return (
    <Card
      sx={{ paddingTop: 2, paddingRight: 2, borderRadius: 5, height: "100%" }}
    >
      <Typography variant="h5" align="center">
        Volume
      </Typography>
      <ResponsiveContainer width={graphWidth} aspect={graphAspectRatio}>
        <AreaChart margin={{ left: -15 }} data={graphData} barSize={50}>
          <defs>
            <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C6B4B0" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#C6B4B0" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis type="category" dataKey="Date" />
          <YAxis
            type="number"
            dataKey="Attempts"
            orientation="left"
            tickLine={false}
            fontSize={12}
          />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="Attempts"
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
