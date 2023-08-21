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
import { ClimbGraphData } from "../../static/types"
import { GraphColors } from "../../static/styles"
import { Typography, useTheme } from "@mui/material"
import { useMediaQuery } from "@mui/material"

export type GradeGraphProps = {
  climbType: string
  graphData: ClimbGraphData[]
}

function GradePyramid({ climbType, graphData }: GradeGraphProps) {
  const theme = useTheme()
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  const graphWidth = mdScreenAndUp ? 350 : xsScreen ? 250 : 300
  //const graphAspectRatio = mdScreenAndUp ? 1 : xsScreen ? 1.3 : 2

  if (graphData.length > 0) {
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
  } else {
    return (
      <Typography
        variant="h3"
        padding={10}
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        --
      </Typography>
    )
  }
}

export default GradePyramid
