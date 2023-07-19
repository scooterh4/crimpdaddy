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
import { ClimbGraphData } from "../static/types"
import { GraphColors } from "../static/styles"
import GradePyramidsLegend from "./GradePyramidsLegend"

export type GradeGraphProps = {
  climbType: string
  graphData: ClimbGraphData[]
}

function GradeGraph({ climbType, graphData }: GradeGraphProps) {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (graphData.length > 0) {
      setHeight(graphData.length * 40)
    }
  }, [graphData])

  return (
    <ResponsiveContainer height={height} width={300}>
      <BarChart
        layout="vertical"
        margin={{ left: -15 }}
        data={graphData}
        barSize={30}
      >
        <XAxis type="number" />
        <YAxis
          type="category"
          tickCount={graphData.length}
          dataKey="Grade"
          tickLine={false}
          fontSize={12}
        />
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
