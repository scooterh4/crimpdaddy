import React, { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts"
import { Card, Grid, Typography, useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import moment, { Moment } from "moment"
import { GraphColors } from "../../../static/styles"
import { useUserContext } from "../protected-context"
import AppLoading from "../../common/loading"
import { ClimbLog } from "../../../static/types"
import { PromiseTrackerArea } from "../../../static/constants"
import { usePromiseTracker } from "react-promise-tracker"
import { getMinimumMoment } from "../../../util/data-helper-functions"
import { Square } from "@mui/icons-material"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

type Props = {
  filter: string
}

type ClimbsByDate = {
  climbs: number
  attempts: number
  date: string
  timestamp: number
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

  function filterRawClimbingData(data: ClimbLog[], range: string): void {
    const minMoment = getMinimumMoment(range)
    let result = setResultDates(minMoment.clone(), moment())
    let yAxisRange = 0

    data.forEach((climb) => {
      // check if the climb is within the date range first
      if (climb.unixTime < minMoment.unix()) {
        return
      }

      const date = moment
        .unix(climb.unixTime)
        .format("MMM DD, YYYY")
        .toString()

      const dateAlreadyAdded = result.find((r) => r.date === date)
      if (dateAlreadyAdded) {
        if (climb.tick === "Attempt") {
          dateAlreadyAdded.attempts += climb.count
        } else {
          dateAlreadyAdded.climbs += climb.count
        }

        // update the maxRange for the y-axis
        if (dateAlreadyAdded.climbs + dateAlreadyAdded.attempts > yAxisRange) {
          yAxisRange = dateAlreadyAdded.climbs + dateAlreadyAdded.attempts
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
        climbs: 0,
        attempts: 0,
        date: minMoment.format("MMM DD, YYYY").toString(),
        timestamp: minMoment.unix(),
      })

      minMoment.add(1, "days")
    }

    return result
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload) {
      return (
        <Card>
          <p>--</p>
        </Card>
      )
    }

    const climbs = payload.find((p) => p.dataKey === "climbs")
    const attempts = payload.find((p) => p.dataKey === "attempts")

    return (
      <Card sx={{ fontFamily: "poppins", padding: 2 }}>
        <Typography
          component="div"
          fontWeight={"bold"}
          gutterBottom
          textAlign={"center"}
        >
          {payload[0].payload.date}
        </Typography>

        {!climbs ||
          !attempts ||
          (climbs.value === 0 && attempts.value === 0 ? (
            <Typography component="div" textAlign={"center"}>
              --
            </Typography>
          ) : (
            <>
              <Grid
                container
                direction={"row"}
                item
                justifyContent={"center"}
                sx={{ display: "flex" }}
              >
                <Square sx={{ color: GraphColors.Sends }} />
                <Typography component="div">
                  Climbs: <b>{climbs.value}</b>
                </Typography>
              </Grid>

              <Grid
                container
                direction={"row"}
                item
                justifyContent={"center"}
                sx={{ display: "flex" }}
              >
                <Square sx={{ color: GraphColors.Attempts }} />
                <Typography component="div">
                  Attempts: <b>{attempts.value}</b>
                </Typography>
              </Grid>
            </>
          ))}
      </Card>
    )
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
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="climbs" stackId="a" fill={GraphColors.Sends} />
        <Bar dataKey="attempts" stackId="a" fill={GraphColors.Attempts} />
      </BarChart>
    </ResponsiveContainer>
  )
}
