import React, { useEffect, useState } from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ClimbLog } from "../static/types"
import { Card, Typography, useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import { CLIMB_TYPES } from "../static/constants"
import { BOULDER_GRADES, INDOOR_SPORT_GRADES } from "../static/constants"
import { GraphColors } from "../static/styles"

export type MonthlyClimbsGraphProps = {
  climbType: number
  climbingData: ClimbLog[]
}

export type HardestClimbGraphData = {
  Month: string
  Onsight: string
  Flash: string
  Redpoint: string
  [key: string]: string
}

function MonthlyClimbsGraph({
  climbType,
  climbingData,
}: MonthlyClimbsGraphProps) {
  const [graphData, setGraphData] = useState<HardestClimbGraphData[]>([])
  const gradeSystem =
    climbType === CLIMB_TYPES.Boulder ? BOULDER_GRADES : INDOOR_SPORT_GRADES
  const title = climbType === CLIMB_TYPES.Boulder ? "Boulder" : "Lead"

  const theme = useTheme()
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  const graphWidth = mdScreenAndUp ? 600 : xsScreen ? 350 : 450
  const graphAspectRatio = mdScreenAndUp ? 2.1 : xsScreen ? 1.3 : 2

  useEffect(() => {
    if (climbingData.length > 0) {
      const monthOrder: { [month: string]: number } = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12,
      }

      let result: HardestClimbGraphData[] = []

      climbingData.forEach((climb) => {
        if (climb.ClimbType !== title) {
          return
        }

        const month = climb.DateTime.toDate().toLocaleString("default", {
          month: "short",
          year: "numeric",
        })

        const climbMonthAdded = result.find((r) => r.Month === month)

        if (climbMonthAdded) {
          if (
            gradeSystem.indexOf(climb.Grade) >
            gradeSystem.indexOf(climbMonthAdded[climb.Tick])
          ) {
            climbMonthAdded[climb.Tick] = climb.Grade
          }
        } else {
          switch (climb.Tick) {
            case "Onsight":
              result.push({
                Month: month,
                Onsight: climb.Grade,
                Flash: "",
                Redpoint: "",
              })
              break

            case "Flash":
              result.push({
                Month: month,
                Onsight: "",
                Flash: climb.Grade,
                Redpoint: "",
              })
              break

            case "Redpoint":
              result.push({
                Month: month,
                Onsight: "",
                Flash: "",
                Redpoint: climb.Grade,
              })
              break
          }
        }
      })

      // Sort the result array by month using the custom order
      result.sort((a, b) => {
        const monthA = a.Month.split(" ")[0]
        const monthB = b.Month.split(" ")[0]
        return monthOrder[monthA] - monthOrder[monthB]
      })

      setGraphData(result)
    }
  }, [climbingData])

  return (
    <Card
      sx={{ paddingTop: 2, paddingRight: 2, borderRadius: 5, height: "100%" }}
    >
      <Typography variant="h5" align="center">
        {title}
      </Typography>
      <ResponsiveContainer width={graphWidth} aspect={graphAspectRatio}>
        <LineChart
          width={500}
          height={300}
          data={graphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="Month" />
          <YAxis type="category" dataKey="Grade" domain={gradeSystem} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Onsight"
            stroke={GraphColors.Onsight}
            fill={GraphColors.Onsight}
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="Flash"
            stroke={GraphColors.Flash}
            fill={GraphColors.Flash}
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="Redpoint"
            stroke={GraphColors.Redpoint}
            fill={GraphColors.Redpoint}
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default MonthlyClimbsGraph
