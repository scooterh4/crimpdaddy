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
import { useTheme } from "@mui/material"
import { useMediaQuery } from "@mui/material"

export type GradeGraphProps = {
  climbType: string
  graphData: ClimbGraphData[]
}

function GradeGraph({ climbType, graphData }: GradeGraphProps) {
  const theme = useTheme()
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  const graphWidth = mdScreenAndUp ? 350 : xsScreen ? 250 : 300
  //const graphAspectRatio = mdScreenAndUp ? 1 : xsScreen ? 1.3 : 2

  return (
    <ResponsiveContainer width={graphWidth} aspect={1}>
      <BarChart
        layout="vertical"
        data={graphData}
        barSize={30}
        style={{ marginLeft: -20 }}
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
