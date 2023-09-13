import React, { useContext, useEffect, useState } from "react"
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
import { CLIMB_TYPES } from "../../static/constants"
import { BOULDER_GRADES, INDOOR_SPORT_GRADES } from "../../static/constants"
import { GraphColors } from "../../static/styles"
import { UserContext } from "../context-api"
import {
  ClimbLogDocument,
  GetAllUserClimbsByType,
} from "../../db/ClimbLogService"
import moment, { Moment } from "moment"
import AppLoading from "../common/AppLoading"

export type MonthlyClimbsGraphProps = {
  climbType: number
  climbingData: ClimbLog[]
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

function MonthlyClimbsGraph({
  climbType,
  climbingData,
  filter,
}: MonthlyClimbsGraphProps) {
  const [graphData, setGraphData] = useState<HardestClimbGraphData[]>([])
  const [gradeRange, setGradeRange] = useState<string[]>([])
  const gradeSystem =
    climbType === CLIMB_TYPES.Boulder ? BOULDER_GRADES : INDOOR_SPORT_GRADES
  // const { user } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const theme = useTheme()
  const lgScreenAndUp = useMediaQuery(theme.breakpoints.up("lg"))
  const mdScreenOnly = useMediaQuery(theme.breakpoints.only("md"))
  const smScreenOnly = useMediaQuery(theme.breakpoints.only("sm"))

  const graphAspectRatio =
    lgScreenAndUp || mdScreenOnly ? 2.3 : smScreenOnly ? 1.6 : 1.1
  const graphLeftMargin = climbType === CLIMB_TYPES.Boulder ? -20 : -10
  const graphFontSize = lgScreenAndUp || mdScreenOnly || smScreenOnly ? 14 : 11

  // sets the graph data from the initial data passed in by the dashboard
  useEffect(() => {
    if (climbingData.length > 0) {
      filterRawClimbingData(climbingData)
    }
  }, [climbingData])

  // need to call the db to get the users data again and resort through it
  // useEffect(() => {
  //   setIsLoading(true)
  //   if (user) {
  //     GetAllUserClimbsByType(user.id, climbType, filter).then((data) => {
  //       filterRawClimbingData(data)
  //     })
  //   } else {
  //     console.log("ProgressionGraph error: no user data")
  //     setIsLoading(false)
  //   }
  // }, [filter])

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

  function filterRawClimbingData(climbingData: ClimbLogDocument[]) {
    // Get the first date that data is available
    const times = [
      ...climbingData.map((climb) => {
        return climb.Timestamp.seconds
      }),
    ]
    const startTime = Math.min.apply(null, times)

    let result = setResultDates(moment.unix(startTime))

    // for the y-axis range
    let gradeMaxIndex = 0
    let gradeMinIndex = gradeSystem.length

    climbingData.forEach((climb) => {
      // All climbs should be in the correct date range
      let month = ""

      try {
        const dateToConvert = climb.Timestamp.toDate()

        month = moment(
          `${dateToConvert.getFullYear()}-${dateToConvert.getMonth() +
            1}-${dateToConvert.getDate()}`,
          "YYYY-MM-D"
        )
          .format("MMM YYYY")
          .toString()
      } catch {
        // *************
        // TODO Need to set the timestamp in sessionstorage to an actual Unix timestamp (not a firestore timestamp)
        // *************
        month = moment(climb.Timestamp, "MMM YYYY").toString()
        console.log("climb date", month)
      }

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
    setIsLoading(false)
  }

  if (isLoading) {
    return <AppLoading />
  } else if (graphData.length > 0) {
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

export default MonthlyClimbsGraph
