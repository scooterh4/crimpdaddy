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
import {
  Card,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import moment from "moment"
import { GraphColors } from "../../static/styles"
import ReactLoading from "react-loading"
import { GetAllUserClimbs } from "../../db/ClimbLogService"
import { UserContext } from "../../db/Context"

export type MonthlyClimbsGraphProps = {
  propClimbingData: ClimbLog[]
}

export type ClimbsByDate = {
  Climbs: number
  Attempts: number
  Date: string
  Timestamp: number
}

function MonthlyClimbsGraph({ propClimbingData }: MonthlyClimbsGraphProps) {
  const [graphData, setGraphData] = useState<ClimbsByDate[]>([])
  const [graphMaxRange, setGraphMaxRange] = useState<number>(15)
  const [range, setRange] = React.useState("thisWeek")
  const { user } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const theme = useTheme()
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  const graphWidth = mdScreenAndUp ? 1000 : xsScreen ? 300 : 500
  const graphAspectRatio = mdScreenAndUp ? 2.1 : xsScreen ? 1.3 : 2

  // sets the graph data from the initial data passed in by the dashboard
  useEffect(() => {
    if (propClimbingData.length > 0) {
      filterRawClimbingData(propClimbingData, "thisWeek")
    }
  }, [propClimbingData])

  function filterRawClimbingData(data: ClimbLog[], range: string): void {
    const dateRange = getDateRange(range)
    let result = setResultDates(range)

    data.forEach((climb) => {
      // check if the climb is within the date range first
      if (
        climb.Timestamp.seconds < dateRange.MinTimestamp ||
        climb.Timestamp.seconds > dateRange.MaxTimestamp
      ) {
        return
      }

      const date = moment(climb.Timestamp.toDate())
        .format("MMM D, YYYY")
        .toString()

      const dateAlreadyAdded = result.find((r) => r.Date === date)

      if (dateAlreadyAdded) {
        if (climb.Tick === "Attempt") {
          dateAlreadyAdded.Attempts += climb.Count
        } else {
          dateAlreadyAdded.Climbs += climb.Count
        }
      }
    })

    setGraphData(result)
    setIsLoading(false)
  }

  // need to call the db to get the users data again and resort through it
  const handleFilterChange = (event: SelectChangeEvent) => {
    setRange(event.target.value)
    setIsLoading(true)
    if (user) {
      GetAllUserClimbs(user.id).then((data) => {
        filterRawClimbingData(data.climbingData, event.target.value)
      })
    } else {
      console.log("VolumeGraph error: no user data")
      setIsLoading(false)
    }
  }

  type DateRange = {
    MinTimestamp: number
    MaxTimestamp: number
  }

  function getDateRange(range: string): DateRange {
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
            1}-${firstDayOfWeek.getDate()} 00:00:00`
        ).unix()
        maxTimestamp = moment(
          `${lastDayOfWeek.getFullYear()}-${lastDayOfWeek.getMonth() +
            1}-${lastDayOfWeek.getDate()} 23:59:59`
        ).unix()
        break

      case "thisMonth":
        // the .getMonth() method returns the month in a zero-based format
        minTimestamp = moment(
          `${today.getFullYear()}-${today.getMonth() + 1}-01 00:00:00`
        ).unix()
        maxTimestamp = moment().unix()
        break

      case "thisYear":
        minTimestamp = moment(`${today.getFullYear()}-01-01 00:00:00`).unix()
        maxTimestamp = moment().unix()
        break

      // alltime
      default:
        break
    }

    return { MinTimestamp: minTimestamp, MaxTimestamp: maxTimestamp }
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
      Date: moment(`${year}-${month}-${day}`)
        .format("MMM D, YYYY")
        .toString(),
      Timestamp: moment(`${year}-${month}-${day}`).unix(),
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
      <Card
        sx={{
          paddingTop: 2,
          borderRadius: 5,
          width: graphWidth,
          height: 300,
        }}
      >
        <Grid
          container
          justifyContent={"center"}
          alignItems={"center"}
          direction="row"
        >
          <Grid item marginTop={10}>
            <ReactLoading
              type="spin"
              color="#0000FF"
              height={200}
              width={100}
            />
          </Grid>
        </Grid>
      </Card>
    )
  }

  return (
    <Card
      sx={{ paddingTop: 2, paddingRight: 2, borderRadius: 5, width: "100%" }}
    >
      <Grid
        container
        justifyContent={"center"}
        alignItems={"center"}
        direction="row"
      >
        <Grid item sm={3} />

        <Grid item sm={6}>
          <Typography variant="h5" align="center">
            Volume
          </Typography>
        </Grid>

        <Grid item sm={3}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select value={range} onChange={handleFilterChange} displayEmpty>
              <MenuItem value={"thisWeek"}>This week</MenuItem>
              <MenuItem value={"thisMonth"}>This month</MenuItem>
              <MenuItem value={"lastMonth"}>Last month</MenuItem>
              {/* <MenuItem value={"thisYear"}>This year</MenuItem> */}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <ResponsiveContainer width={graphWidth} aspect={graphAspectRatio}>
        <BarChart
          height={1000}
          data={graphData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="Date" />
          <YAxis
            type="number"
            dataKey="Attempts"
            domain={[0, graphMaxRange]}
            tickCount={6}
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="Climbs"
            stackId="a"
            fill="#615847"
            isAnimationActive={false}
          />
          <Bar
            dataKey="Attempts"
            stackId="a"
            fill={GraphColors.Attempts}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default MonthlyClimbsGraph
