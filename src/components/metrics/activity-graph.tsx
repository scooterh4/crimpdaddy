import React, { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import moment, { Moment } from "moment"
import { AppColors, GraphColors } from "../../styles/styles"
import { useUserContext } from "../../user-context"
import AppLoading from "../common/app-loading"
import { ClimbLog } from "../../types"
import { PromiseTrackerArea } from "../../constants"
import { usePromiseTracker } from "react-promise-tracker"
import { getMinimumMoment } from "../../util/data-helper-functions"

type Props = {
  filter: number
}

type ClimbsByDate = {
  Climbs: number
  Attempts: number
  Date: string
  Timestamp: number
}

export default function ActivityGraph({ filter }: Props) {
  const { userClimbingLogs } = useUserContext()
  const { promiseInProgress } = usePromiseTracker({
    area: PromiseTrackerArea.Activity,
  })
  const [graphData, setGraphData] = useState<ClimbsByDate[]>([])
  const [graphMaxRange, setGraphMaxRange] = useState<number>(15)

  const theme = useTheme()
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const smScreenOnly = useMediaQuery(theme.breakpoints.only("sm"))
  const graphAspectRatio = mdScreenAndUp ? 4 : smScreenOnly ? 2 : 1.1

  // sets the graph data from the initial data passed in by the dashboard
  useEffect(() => {
    if (userClimbingLogs) {
      filterRawClimbingData(userClimbingLogs, filter)
    }
  }, [filter])

  useEffect(() => {
    if (userClimbingLogs && userClimbingLogs.length > 0) {
      filterRawClimbingData(userClimbingLogs, filter)
    }
  }, [userClimbingLogs])

  function filterRawClimbingData(data: ClimbLog[], range: number): void {
    const minMoment = getMinimumMoment(range)
    let result = setResultDates(minMoment.clone(), moment())
    let yAxisRange = 0

    data.forEach((climb) => {
      // check if the climb is within the date range first
      if (climb.UnixTime < minMoment.unix()) {
        return
      }

      const date = moment
        .unix(climb.UnixTime)
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
  }

  function setResultDates(
    minMoment: Moment,
    maxMoment: Moment
  ): ClimbsByDate[] {
    let result: ClimbsByDate[] = []

    while (minMoment <= maxMoment) {
      result.push({
        Climbs: 0,
        Attempts: 0,
        Date: minMoment.format("MMM DD, YYYY").toString(),
        Timestamp: minMoment.unix(),
      })

      minMoment.add(1, "days")
    }

    return result
  }

  if (promiseInProgress) {
    return <AppLoading />
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
        <YAxis
          type="number"
          dataKey="Attempts"
          domain={[0, graphMaxRange]}
          allowDecimals={false}
        />
        <Tooltip />
        <Bar dataKey="Climbs" stackId="a" fill={AppColors.success} />
        <Bar dataKey="Attempts" stackId="a" fill={GraphColors.Attempts} />
      </BarChart>
    </ResponsiveContainer>
  )
}
