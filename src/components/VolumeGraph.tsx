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
import { ClimbLog } from "../static/types"
import {
  Card,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import moment from "moment"
import { GraphColors } from "../static/styles"
import { Timestamp } from "firebase/firestore"
import ReactLoading from "react-loading"
import { GetAllUserClimbs } from "../db/ClimbLogService"
import { UserContext } from "../db/Context"

export type MonthlyClimbsGraphProps = {
  propClimbingData: ClimbLog[]
}

export type ClimbsByDate = {
  Climbs: number
  Attempts: number
  Date: string
  Timestamp: Timestamp
}

function MonthlyClimbsGraph({ propClimbingData }: MonthlyClimbsGraphProps) {
  const [graphData, setGraphData] = useState<ClimbsByDate[]>([])
  const [graphMaxRange, setGraphMaxRange] = useState<number>(25)
  const [range, setRange] = React.useState("alltime")
  const { user, updateUser } = useContext(UserContext)

  const theme = useTheme()
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  const graphWidth = mdScreenAndUp ? 700 : xsScreen ? 300 : 500
  const graphAspectRatio = mdScreenAndUp ? 2.1 : xsScreen ? 1.3 : 2

  function compareTimestamps(a: ClimbsByDate, b: ClimbsByDate) {
    if (a.Timestamp < b.Timestamp) {
      return -1
    }
    if (a.Timestamp > b.Timestamp) {
      return 1
    }
    return 0
  }

  function filterRawClimbingData(data: ClimbLog[], range: string): void {
    let result: ClimbsByDate[] = []
    const today = new Date()
    let minTimestamp = 0
    let maxTimestamp = moment().unix()

    console.log("month", today.getMonth())
    console.log("year", today.getFullYear())

    // set the date range we want the data for
    switch (range) {
      case "thisYear":
        minTimestamp = moment(`${today.getFullYear()}-01-01`).unix()
        maxTimestamp = moment().unix()
        break

      case "lastYear":
        minTimestamp = moment(`${today.getFullYear() - 1}-01-01`).unix()
        maxTimestamp = moment(`${today.getFullYear()}-01-01`).unix()
        break

      case "thisMonth":
        minTimestamp = moment(
          `${today.getFullYear()}-${today.getMonth() + 1}-01`
        ).unix()
        maxTimestamp = moment().unix()
        break

      case "lastMonth":
        if (today.getMonth() === 1) {
          minTimestamp = moment(`${today.getFullYear() - 1}-12-01`).unix()
          maxTimestamp = moment(`${today.getFullYear()}-01-01`).unix()
        } else {
          minTimestamp = moment(
            `${today.getFullYear().toString()}-${today.getMonth()}-01`
          ).unix()
          maxTimestamp = moment(
            `${today.getFullYear().toString()}-${today.getMonth() + 1}-01`
          ).unix()
        }
        break

      // alltime
      default:
        break
    }

    console.log("minTimestamp", minTimestamp)
    console.log("maxTimestamp", maxTimestamp)

    data.forEach((climb) => {
      console.log("climb seconds", climb.Timestamp.seconds)
      // check if the climb is within the date range first
      if (
        climb.Timestamp.seconds < minTimestamp ||
        climb.Timestamp.seconds > maxTimestamp
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
      } else {
        if (climb.Tick === "Attempt") {
          result.push({
            Climbs: 0,
            Attempts: climb.Count,
            Date: date,
            Timestamp: climb.Timestamp,
          })
        } else {
          result.push({
            Climbs: climb.Count,
            Attempts: 0,
            Date: date,
            Timestamp: climb.Timestamp,
          })
        }
      }
    })

    result.sort(compareTimestamps)
    setGraphData(result)
  }

  // sets the graph data from the initial data passed in by the dashboard
  useEffect(() => {
    if (propClimbingData.length > 0) {
      filterRawClimbingData(propClimbingData, "alltime")
    }
  }, [propClimbingData])

  // need to call the db to get the users data again and resort through it
  const handleFilterChange = (event: SelectChangeEvent) => {
    console.log(event.target.value)
    setRange(event.target.value)
    setIsLoading(true)
    if (user) {
      GetAllUserClimbs(user.id).then((data) => {
        filterRawClimbingData(data.climbingData, event.target.value)
        setIsLoading(false)
      })
    } else {
      console.log("Error getting climbing data for volume graph: no user id.")
      setIsLoading(false)
    }
  }

  const [isLoading, setIsLoading] = useState<boolean>(false)

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
              <MenuItem value={"alltime"}>All-time</MenuItem>
              <MenuItem value={"thisYear"}>This year</MenuItem>
              <MenuItem value={"lastYear"}>Last year</MenuItem>
              <MenuItem value={"thisMonth"}>This month</MenuItem>
              <MenuItem value={"lastMonth"}>Last month</MenuItem>
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
            fill="#665b59"
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
