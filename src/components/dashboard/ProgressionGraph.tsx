import React, { useEffect, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ClimbLog } from "../../static/types"
import { Typography, useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import { CLIMB_TYPES, GYM_CLIMB_TYPES } from "../../static/constants"
import { BOULDER_GRADES, INDOOR_SPORT_GRADES } from "../../static/constants"
import { GraphColors } from "../../static/styles"
import { useUserContext } from "../context-api"
import moment, { Moment } from "moment"

export type MonthlyClimbsGraphProps = {
  climbType: number
  filter: number
}

export type HardestClimbGraphData = {
  Month: string
  Onsight: string
  Flash: string
  Redpoint: string
  [key: string]: string
}

export type ProgressionGraphDateRange = {
  minDate: Date
  maxDate: Date
}

function MonthlyClimbsGraph({ climbType, filter }: MonthlyClimbsGraphProps) {
  const {
    userClimbingLogs,
    userBoulderLogs,
    userLeadLogs,
    userTopRopeLogs,
  } = useUserContext()
  const [graphData, setGraphData] = useState<HardestClimbGraphData[]>([])
  const [gradeRange, setGradeRange] = useState<string[]>([])
  const gradeSystem =
    climbType === CLIMB_TYPES.Boulder ? BOULDER_GRADES : INDOOR_SPORT_GRADES

  const theme = useTheme()
  const lgScreenAndUp = useMediaQuery(theme.breakpoints.up("lg"))
  const mdScreenOnly = useMediaQuery(theme.breakpoints.only("md"))
  const smScreenOnly = useMediaQuery(theme.breakpoints.only("sm"))

  const graphAspectRatio =
    lgScreenAndUp || mdScreenOnly ? 2.3 : smScreenOnly ? 1.6 : 1.1
  const graphLeftMargin = climbType === CLIMB_TYPES.Boulder ? -20 : -10
  const graphFontSize = lgScreenAndUp || mdScreenOnly || smScreenOnly ? 14 : 11

  useEffect(() => {
    switch (climbType) {
      case GYM_CLIMB_TYPES.Boulder:
        if (userBoulderLogs) {
          filterRawClimbingData(userBoulderLogs)
        }
        break
      case GYM_CLIMB_TYPES.Lead:
        if (userLeadLogs) {
          filterRawClimbingData(userLeadLogs)
        }
        break
      case GYM_CLIMB_TYPES.TopRope:
        if (userTopRopeLogs) {
          filterRawClimbingData(userTopRopeLogs)
        }
        break
    }
  }, [userClimbingLogs])

  function setResultDates(startMoment: Moment) {
    let result: HardestClimbGraphData[] = []

    while (startMoment.month() <= moment().month()) {
      const monthToAdd = startMoment.format("MMM YYYY").toString()

      result.push({
        Month: monthToAdd,
        Onsight: "",
        Flash: "",
        Redpoint: "",
      })

      startMoment = startMoment.add(1, "month")
    }

    return result
  }

  function filterRawClimbingData(climbingData: ClimbLog[]) {
    // Get the first date that data is available
    const times = [
      ...climbingData.map((climb) => {
        return climb.UnixTime
      }),
    ]
    const startTime = Math.min.apply(null, times)

    let result = setResultDates(moment.unix(startTime))

    // for the y-axis range
    let gradeMaxIndex = 0
    let gradeMinIndex = gradeSystem.length

    climbingData.forEach((climb) => {
      // All climbs should be in the correct date range

      const month = moment
        .unix(climb.UnixTime)
        .format("MMM YYYY")
        .toString()

      const climbMonthAdded = result.find((r) => r.Month === month)

      if (climbMonthAdded) {
        // update the grade index for the y-axis range
        gradeMaxIndex =
          gradeMaxIndex < gradeSystem.indexOf(climb.Grade)
            ? gradeSystem.indexOf(climb.Grade)
            : gradeMaxIndex

        gradeMinIndex =
          gradeMinIndex > gradeSystem.indexOf(climb.Grade)
            ? gradeSystem.indexOf(climb.Grade)
            : gradeMinIndex

        if (
          gradeSystem.indexOf(climb.Grade) >
          gradeSystem.indexOf(climbMonthAdded[climb.Tick])
        ) {
          climbMonthAdded[climb.Tick] = climb.Grade
        }
      }
    })

    gradeMaxIndex += 2
    gradeMinIndex = gradeMinIndex > 0 ? gradeMinIndex - 1 : 0

    setGradeRange(gradeSystem.slice(gradeMinIndex, gradeMaxIndex))
    setGraphData(result)
  }

  console.log("ProgressionGraph data:", graphData)

  if (graphData.length <= 0) {
    return (
      <Typography
        variant="h3"
        padding={10}
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        --
      </Typography>
    )
  } else {
    return (
      <ResponsiveContainer aspect={graphAspectRatio}>
        <LineChart
          data={graphData}
          margin={{
            top: 20,
            right: 0,
            left: graphLeftMargin,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="Month" fontSize={graphFontSize} />
          <YAxis
            type="category"
            dataKey="Grade"
            domain={gradeRange}
            fontSize={graphFontSize}
          />
          <Tooltip />
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
    )
  }
}

export default MonthlyClimbsGraph
