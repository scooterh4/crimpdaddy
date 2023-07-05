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
          justifyContent: "left",
          alignItems: "center",
          marginLeft: "10.5rem",
        }}
      >
        {climbType}
      </Typography>
      <BarChart
        layout="vertical"
        width={500}
        height={300}
        data={graphData}
        barSize={100}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis type="number" />
        <YAxis type="category" dataKey="Grade" width={150} tickLine={false} />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="0 0" />
        <Bar dataKey="Onsight" stackId="a" fill="#16BA6F" />
        <Bar dataKey="Flash" stackId="a" fill="#FFC733" />
        <Bar dataKey="Redpoint" stackId="a" fill="#FF4633" />
        <Bar dataKey="Attempts" stackId="a" fill="#C4C4C4" />
      </BarChart>
    </div>
  )
}

export default GradeGraph
