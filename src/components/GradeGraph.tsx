import React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ClimbGraphData } from "../static/types"
import { Typography } from "@mui/material"

export type GradeGraphProps = {
  climbType: string
  graphData: ClimbGraphData[]
}

function GradeGraph({ climbType, graphData }: GradeGraphProps) {
  return (
    <div style={{ justifyContent: "center" }}>
      <Typography
        variant="h4"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {climbType}
      </Typography>

      <BarChart
        layout="vertical"
        width={500}
        height={300}
        data={graphData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barSize={100}
      >
        <XAxis type="number" />
        <YAxis type="category" dataKey="Grade" width={150} tickLine={false} />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="0 0" />
        <Bar dataKey="Attempts" stackId="a" fill="#8884d8" />
        {/* <Bar dataKey="Flash" stackId="a" fill="#82ca9d" /> */}
      </BarChart>
    </div>
  )
}

export default GradeGraph
