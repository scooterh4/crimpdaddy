import React, { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ClimbLog } from "../static/types"
import { Card, Typography, useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import moment from "moment"
import { GraphColors } from "../static/styles"
import { Timestamp } from "firebase/firestore"

export type MonthlyClimbsGraphProps = {
  climbingData: ClimbLog[]
}

export type ClimbsByDate = {
  Climbs: number
  Attempts: number
  Date: string
  Timestamp: Timestamp
}

function MonthlyClimbsGraph({ climbingData }: MonthlyClimbsGraphProps) {
  const [graphData, setGraphData] = useState<ClimbsByDate[]>([])
  const [graphMaxRange, setGraphMaxRange] = useState<number>(25)

  const theme = useTheme()
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  const graphWidth = mdScreenAndUp ? 700 : xsScreen ? 300 : 500
  const graphAspectRatio = mdScreenAndUp ? 2.1 : xsScreen ? 1.3 : 2

  function compareTimestamps(a: ClimbsByDate, b: ClimbsByDate) {
    if (a.Timestamp < b.Timestamp) {
      return -1
    }
    if (a.Timestamp > b.Timestamp) {
      return 1
    }
    return 0
  }

  useEffect(() => {
    if (climbingData.length > 0) {
      let result: ClimbsByDate[] = []

      climbingData.forEach((climb) => {
        const date = moment(climb.Timestamp.toDate())
          .format("MMM D, YYYY")
          .toString()
        const dateAlreadyAdded = result.find((r) => r.Date === date)

        if (dateAlreadyAdded) {
          if (climb.Tick === "Attempt") {
            dateAlreadyAdded.Attempts += climb.Count
          } else {
            dateAlreadyAdded.Climbs += climb.Count
          }
        } else {
          if (climb.Tick === "Attempt") {
            result.push({
              Climbs: 0,
              Attempts: climb.Count,
              Date: date,
              Timestamp: climb.Timestamp,
            })
          } else {
            result.push({
              Climbs: climb.Count,
              Attempts: 0,
              Date: date,
              Timestamp: climb.Timestamp,
            })
          }
        }
      })

      result.sort(compareTimestamps)
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
        <BarChart
          height={1000}
          data={graphData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="Date" />
          <YAxis
            type="number"
            dataKey="Attempts"
            domain={[0, graphMaxRange]}
            tickCount={6}
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="Climbs"
            stackId="a"
            fill="#665b59"
            isAnimationActive={false}
          />
          <Bar
            dataKey="Attempts"
            stackId="a"
            fill={GraphColors.Attempts}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default MonthlyClimbsGraph
