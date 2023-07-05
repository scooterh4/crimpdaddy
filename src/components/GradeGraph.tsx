import React from "react"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"
import { ClimbGraphData } from "../static/types"
import { GraphColors } from "../static/styles"
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
          mt: 5,
          ml: 19,
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
      >
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="Grade"
          width={150}
          tickLine={false}
          fontSize={12}
        />
        <Tooltip />
        <CartesianGrid strokeDasharray="0 0" />
        <Bar dataKey="Onsight" stackId="a" fill={GraphColors.Onsight} />
        <Bar dataKey="Flash" stackId="a" fill={GraphColors.Flash} />
        <Bar dataKey="Redpoint" stackId="a" fill={GraphColors.Redpoint} />
        <Bar dataKey="Attempts" stackId="a" fill={GraphColors.Attempts} />
      </BarChart>
    </div>
  )
}

export default GradeGraph
