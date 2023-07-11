import React, { useContext, useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { MonthlyClimbData } from "../static/types"
import { GetMonthlyClimbsByUser } from "../db/ClimbLogService"
import { UserContext } from "../db/Context"
import { Card, Typography } from "@mui/material"

function MonthlyClimbsGraph() {
  const { user } = useContext(UserContext)
  const [graphData, setClimbingData] = useState<MonthlyClimbData[]>([])

  useEffect(() => {
    if (user) {
      GetMonthlyClimbsByUser(user.id).then((data) => {
        setClimbingData(data)
      })
    }
  }, [user])

  return (
    <Card sx={{ paddingTop: 2, paddingRight: 2, borderRadius: 5 }}>
      <Typography variant="h5" align="center">
        Climbs by Month
      </Typography>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          layout="horizontal"
          margin={{ left: -15 }}
          data={graphData}
          barSize={50}
        >
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
