import React, { useContext, useEffect, useState } from "react"
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
import { ClimbLog } from "../../static/types"
import { Grid, useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import moment from "moment"
import { GraphColors, ThemeColors } from "../../static/styles"
import ReactLoading from "react-loading"
import { GetAllUserClimbs } from "../../db/ClimbLogService"
import { UserContext } from "../../db/Context"

export type MonthlyClimbsGraphProps = {
  propClimbingData: ClimbLog[]
  filter: string
}

export type ClimbsByDate = {
  Climbs: number
  Attempts: number
  Date: string
  Timestamp: number
}

export type VolumeGraphDateRange = {
  minTimestamp: number
  maxTimestamp: number
}

function ActivityGraph({ propClimbingData, filter }: MonthlyClimbsGraphProps) {
  const [graphData, setGraphData] = useState<ClimbsByDate[]>([])
  const [graphMaxRange, setGraphMaxRange] = useState<number>(15)
  const { user } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const theme = useTheme()
  const lgScreenAndUp = useMediaQuery(theme.breakpoints.up("lg"))
  const mdScreenOnly = useMediaQuery(theme.breakpoints.only("md"))
  const smScreenOnly = useMediaQuery(theme.breakpoints.only("sm"))

  const graphAspectRatio =
    lgScreenAndUp || mdScreenOnly ? 2.6 : smScreenOnly ? 1.9 : 1.1

  // sets the graph data from the initial data passed in by the dashboard
  useEffect(() => {
    if (propClimbingData.length > 0) {
      filterRawClimbingData(propClimbingData, "thisWeek")
    }
  }, [propClimbingData])

  function filterRawClimbingData(data: ClimbLog[], range: string): void {
    const dateRange = getDateRange(range)
    let result = setResultDates(range)
    let yAxisRange = 0

    data.forEach((climb) => {
      // check if the climb is within the date range first
      if (
        climb.Timestamp.seconds < dateRange.minTimestamp ||
        climb.Timestamp.seconds > dateRange.maxTimestamp
      ) {
        return
      }

      const dateToConvert = climb.Timestamp.toDate()

      const date = moment(
        `${dateToConvert.getFullYear()}-${dateToConvert.getMonth() +
          1}-${dateToConvert.getDate()}`,
        "YYYY-MM-DD"
      )
        .format("MMM DD, YYYY")
        .toString()

      const dateAlreadyAdded = result.find((r) => r.Date === date)

      if (dateAlreadyAdded) {
        if (climb.Tick === "Attempt") {
          dateAlreadyAdded.Attempts += climb.Count
        } else {
          dateAlreadyAdded.Climbs += climb.Count
        }

        // update the maxRange for the y-axis
        if (dateAlreadyAdded.Climbs + dateAlreadyAdded.Attempts > yAxisRange) {
          yAxisRange = dateAlreadyAdded.Climbs + dateAlreadyAdded.Attempts
        }
      }
    })

    setGraphMaxRange(yAxisRange + 2 < 9 ? 9 : yAxisRange + 2)
    setGraphData(result)
    setIsLoading(false)
  }

  // need to call the db to get the users data again and resort through it
  useEffect(() => {
    setIsLoading(true)
    if (user) {
      GetAllUserClimbs(user.id, filter).then((data) => {
        filterRawClimbingData(data.climbingData, filter)
      })
    } else {
      console.log("VolumeGraph error: no user data")
      setIsLoading(false)
    }
  }, [filter])

  function getDateRange(range: string): VolumeGraphDateRange {
    const today = new Date()
    let minTimestamp = 0
    let maxTimestamp = moment().unix()

    // set the date range we want the data for
    switch (range) {
      case "thisWeek":
        const firstDayOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay())
        )
        const lastDayOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay() + 6)
        )

        minTimestamp = moment(
          `${firstDayOfWeek.getFullYear()}-${firstDayOfWeek.getMonth() +
            1}-${firstDayOfWeek.getDate()} 00:00:00`,
          "YYYY-MM-DD kk:mm:ss"
        ).unix()
        maxTimestamp = moment(
          `${lastDayOfWeek.getFullYear()}-${lastDayOfWeek.getMonth() +
            1}-${lastDayOfWeek.getDate()} 23:59:59`,
          "YYYY-MM-DD kk:mm:ss"
        ).unix()
        break

      case "thisMonth":
        // the .getMonth() method returns the month in a zero-based format
        minTimestamp = moment(
          `${today.getFullYear()}-${today.getMonth() + 1}-01 00:00:00`,
          "YYYY-MM-DD kk:mm:ss"
        ).unix()
        maxTimestamp = moment().unix()
        break

      case "thisYear":
        minTimestamp = moment(
          `${today.getFullYear()}-01-01 00:00:00`,
          "YYYY-MM-DD kk:mm:ss"
        ).unix()
        maxTimestamp = moment().unix()
        break

      // alltime
      default:
        break
    }

    return { minTimestamp: minTimestamp, maxTimestamp: maxTimestamp }
  }

  function pushDateToResult(
    result: ClimbsByDate[],
    year: number,
    month: number,
    day: number
  ): void {
    result.push({
      Climbs: 0,
      Attempts: 0,
      Date: moment(`${year}-${month}-${day}`, "YYYY-MM-DD")
        .format("MMM DD, YYYY")
        .toString(),
      Timestamp: moment(`${year}-${month}-${day}`, "YYYY-MM-DD").unix(),
    })
  }

  function setResultDates(range: string): ClimbsByDate[] {
    let result: ClimbsByDate[] = []
    const today = new Date()

    switch (range) {
      case "thisWeek":
        const firstDayOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay())
        )
        const lastDayOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay() + 6)
        )

        // Check if the month changes during the week
        if (firstDayOfWeek.getMonth() === lastDayOfWeek.getMonth()) {
          let d = firstDayOfWeek.getDate()

          while (d <= lastDayOfWeek.getDate()) {
            pushDateToResult(
              result,
              firstDayOfWeek.getFullYear(),
              firstDayOfWeek.getMonth() + 1,
              d
            )
            d++
          }
        } else {
          // The month changes midweek so we'll add the dates in two separate loops
          const lastDayOfMonth = new Date(
            firstDayOfWeek.getFullYear(),
            firstDayOfWeek.getMonth() + 1,
            0
          )

          let dayCounter = firstDayOfWeek.getDate()
          while (dayCounter <= lastDayOfMonth.getDate()) {
            pushDateToResult(
              result,
              firstDayOfWeek.getFullYear(),
              firstDayOfWeek.getMonth() + 1,
              dayCounter
            )
            dayCounter++
          }

          let newMonthDayCounter = 1
          while (newMonthDayCounter <= lastDayOfWeek.getDate()) {
            pushDateToResult(
              result,
              lastDayOfWeek.getFullYear(),
              lastDayOfWeek.getMonth() + 1,
              newMonthDayCounter
            )
            newMonthDayCounter++
          }
        }
        break

      case "thisMonth":
        let day = 1
        while (day <= today.getDate()) {
          pushDateToResult(
            result,
            today.getFullYear(),
            today.getMonth() + 1,
            day
          )
          day++
        }
        break

      case "lastMonth":
        const lastDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        )

        let dCount = 1
        while (dCount < lastDayOfLastMonth.getDate()) {
          pushDateToResult(
            result,
            lastDayOfLastMonth.getFullYear(),
            lastDayOfLastMonth.getMonth() + 1,
            dCount
          )
          dCount++
        }
        break

      case "thisYear":
        // loop through the months
        let monthCounter = 1
        while (monthCounter <= 12) {
          let lastDayOfMonth = new Date(today.getFullYear(), monthCounter, 0)

          // loop through the days in each month
          let dayCounter = 1
          while (dayCounter <= lastDayOfMonth.getDate()) {
            pushDateToResult(
              result,
              lastDayOfMonth.getFullYear(),
              lastDayOfMonth.getMonth() + 1,
              dayCounter
            )
            dayCounter++
          }
          monthCounter++
        }
        break
    }

    return result
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
        <ReactLoading
          type="spin"
          color={ThemeColors.darkAccent}
          height={200}
          width={100}
        />
      </Grid>
    )
  }

  return (
    <ResponsiveContainer aspect={graphAspectRatio}>
      <BarChart
        data={graphData}
        margin={{
          top: 20,
          right: 10,
          left: -20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="category" dataKey="Date" />
        <YAxis type="number" dataKey="Attempts" domain={[0, graphMaxRange]} />
        <Tooltip />
        <Bar dataKey="Climbs" stackId="a" fill={GraphColors.Climbs} />
        <Bar dataKey="Attempts" stackId="a" fill={GraphColors.Attempts} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ActivityGraph
