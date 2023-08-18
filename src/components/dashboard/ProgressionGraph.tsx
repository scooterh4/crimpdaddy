import React, { useContext, useEffect, useState } from "react"
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
import { ClimbLog } from "../../static/types"
import { Grid, Typography, useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import { CLIMB_TYPES, MINIMUM_DATE_FOR_DATA } from "../../static/constants"
import { BOULDER_GRADES, INDOOR_SPORT_GRADES } from "../../static/constants"
import { GraphColors } from "../../static/styles"
import ReactLoading from "react-loading"
import { UserContext } from "../../db/Context"
import {
  ClimbLogDocument,
  GetAllUserClimbsByType,
} from "../../db/ClimbLogService"
import moment, { Moment } from "moment"

export type MonthlyClimbsGraphProps = {
  climbType: number
  climbingData: ClimbLog[]
  filter: string
}

export type HardestClimbGraphData = {
  month: string
  onsight: string
  flash: string
  redpoint: string
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
  const { user } = useContext(UserContext)
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
      filterRawClimbingData(climbingData, "last6Months")
    }
  }, [climbingData])

  // need to call the db to get the users data again and resort through it
  useEffect(() => {
    setIsLoading(true)
    if (user) {
      GetAllUserClimbsByType(user.id, climbType, new Date().getFullYear()).then(
        (data) => {
          filterRawClimbingData(data, filter)
        }
      )
    } else {
      console.log("ProgressionGraph error: no user data")
      setIsLoading(false)
    }
  }, [filter])

  function setResultDates(filterRange: string) {
    let result: HardestClimbGraphData[] = []
    const today = moment()
    let date =
      filterRange === "last6Months"
        ? moment().subtract(6, "months")
        : filterRange === "last12Months"
        ? moment().subtract(12, "months")
        : moment().subtract(6, "months")

    // need to redeclare this bc React updates constants for some reason???
    const minDataDate = moment(
      MINIMUM_DATE_FOR_DATA.dateString,
      MINIMUM_DATE_FOR_DATA.formatString
    )
    date = date < minDataDate ? minDataDate : date

    while (date.month() <= today.month()) {
      const monthToAdd = moment(date)
        .format("MMM YYYY")
        .toString()

      result.push({
        month: monthToAdd,
        onsight: "",
        flash: "",
        redpoint: "",
      })

      date = date.add(1, "month")
    }

    return result
  }

  function filterRawClimbingData(
    climbingData: ClimbLogDocument[],
    filterRange: string
  ) {
    let minDate =
      filterRange === "last6Months"
        ? moment().subtract(6, "months")
        : filterRange === "last12Months"
        ? moment().subtract(12, "months")
        : moment().subtract(6, "months")

    const minDataDate = moment(
      MINIMUM_DATE_FOR_DATA.dateString,
      MINIMUM_DATE_FOR_DATA.formatString
    )
    minDate = minDate < minDataDate ? minDataDate : minDate

    let result = setResultDates(filterRange)

    // for the y-axis range
    let gradeMaxIndex = 0
    let gradeMinIndex = gradeSystem.length

    climbingData.forEach((climb) => {
      // check if the climb is within the desired date range
      if (climb.Timestamp.toDate().getMonth() < minDate.month()) {
        return
      }

      const month = moment(climb.Timestamp.toDate())
        .format("MMM YYYY")
        .toString()

      const climbMonthAdded = result.find((r) => r.month === month)

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

    setGradeRange(gradeSystem.slice(gradeMinIndex, gradeMaxIndex))
    setGraphData(result)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <Grid
        container
        justifyContent={"center"}
        alignItems={"center"}
        direction="column"
        marginTop={10}
      >
        <ReactLoading type="spin" color="#0000FF" height={200} width={100} />
      </Grid>
    )
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
