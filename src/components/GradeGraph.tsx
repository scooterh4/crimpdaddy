import React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ClimbGraphData } from "../static/types"
import { GraphColors } from "../static/styles"

export type GradeGraphProps = {
  climbType: string
  graphData: ClimbGraphData[]
}

function GradeGraph({ climbType, graphData }: GradeGraphProps) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart
        layout="vertical"
        margin={{ left: -15 }}
        data={graphData}
        barSize={50}
      >
        <XAxis type="number" />
        <YAxis type="category" dataKey="Grade" tickLine={false} fontSize={12} />
        <Tooltip />
        <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
        <Bar dataKey="Onsight" stackId="a" fill={GraphColors.Onsight} />
        <Bar dataKey="Flash" stackId="a" fill={GraphColors.Flash} />
        <Bar dataKey="Redpoint" stackId="a" fill={GraphColors.Redpoint} />
        <Bar dataKey="Attempts" stackId="a" fill={GraphColors.Attempts} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default GradeGraph
