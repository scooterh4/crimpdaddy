import React, { useEffect, useState } from "react"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts"
import { ClimbLog } from "../../types"
import { Box, Card, Typography, useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import { CLIMB_TYPES, DateFilters, GYM_CLIMB_TYPES } from "../../constants"
import { BOULDER_GRADES, INDOOR_SPORT_GRADES } from "../../constants"
import { AppColors, GraphColors, ThemeColors } from "../../styles/styles"
import { useUserContext } from "../../user-context"
import moment, { Moment } from "moment"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"
import AppLoading from "../common/app-loading"
import { usePromiseTracker } from "react-promise-tracker"

export type MonthlyClimbsGraphProps = {
  climbType: number
  filter: number
}

export type ProgressionGraphData = {
  monthIdx: number
  month: string
  hardestClimbIdx: number
  hardestAttemptIdx: number
  progressionLine: number
}

export type ProgressionGraphDateRange = {
  minDate: Date
  maxDate: Date
}

function MonthlyClimbsGraph({ climbType, filter }: MonthlyClimbsGraphProps) {
  const { promiseInProgress } = usePromiseTracker()
  const {
    userClimbingLogs,
    userBoulderLogs,
    userLeadLogs,
    userTopRopeLogs,
  } = useUserContext()
  const [graphData, setGraphData] = useState<ProgressionGraphData[]>([])
  const [gradeRange, setGradeRange] = useState<number[]>([])
  const [graphXAxis, setGraphXAxis] = useState<string[]>([])
  const gradeSystem =
    climbType === CLIMB_TYPES.Boulder ? BOULDER_GRADES : INDOOR_SPORT_GRADES

  const theme = useTheme()
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const smScreenOnly = useMediaQuery(theme.breakpoints.only("sm"))

  const graphAspectRatio = mdScreenAndUp ? 4.0 : smScreenOnly ? 2 : 1.1
  const graphLeftMargin = climbType === CLIMB_TYPES.Boulder ? -20 : -10
  const graphFontSize = mdScreenAndUp || smScreenOnly ? 14 : 11

  useEffect(() => {
    switch (climbType) {
      case GYM_CLIMB_TYPES.Boulder:
        if (userBoulderLogs && userBoulderLogs.length > 0) {
          filterRawClimbingData(userBoulderLogs)
        }
        break
      case GYM_CLIMB_TYPES.Lead:
        if (userLeadLogs && userLeadLogs.length > 0) {
          filterRawClimbingData(userLeadLogs)
        }
        break
      case GYM_CLIMB_TYPES.TopRope:
        if (userTopRopeLogs && userTopRopeLogs.length > 0) {
          filterRawClimbingData(userTopRopeLogs)
        }
        break
    }
  }, [userClimbingLogs, filter])

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active) {
      if (payload) {
        return (
          <Card sx={{ fontFamily: "poppins", padding: 2 }}>
            <Typography
              component="div"
              fontWeight={"bold"}
              textAlign={"center"}
            >
              {`${graphXAxis[label]}`}
            </Typography>
            <Typography component="div">
              Highest grade climbed:{" "}
              <Box fontWeight="bold" display="inline">
                {`${gradeSystem[graphData[label].hardestClimbIdx]}`}
              </Box>
            </Typography>
            <Typography component="div">
              Highest grade attempted:{" "}
              <Box fontWeight="bold" display="inline">
                {`${
                  gradeSystem[
                    graphData[label].hardestClimbIdx +
                      graphData[label].hardestAttemptIdx
                  ]
                }`}
              </Box>
            </Typography>
          </Card>
        )
      } else {
        return (
          <Card>
            <p>--</p>
          </Card>
        )
      }
    } else {
      return null
    }
  }

  function setResultDates(startMoment: Moment) {
    let result: ProgressionGraphData[] = []
    let xAxis: string[] = []
    let month = 0
    while (
      startMoment.month() <= moment().month() ||
      startMoment.year() < moment().year()
    ) {
      const monthToAdd = startMoment.format("MMM YYYY").toString()

      xAxis.push(monthToAdd)
      result.push({
        month: monthToAdd,
        monthIdx: month,
        hardestClimbIdx: 0,
        hardestAttemptIdx: 0,
        progressionLine: 0,
      } as ProgressionGraphData)
      startMoment = startMoment.add(1, "month")
      month++
    }
    setGraphXAxis(xAxis)
    return result
  }

  function filterRawClimbingData(climbingData: ClimbLog[]) {
    const startTime =
      filter === DateFilters.Last6Months
        ? moment().subtract(6, "months")
        : moment().subtract(12, "months")
    let result = setResultDates(startTime)
    // for the y-axis range
    let gradeMaxIndex = 0

    climbingData.forEach((climb) => {
      // All climbs should be in the correct date range
      const month = moment
        .unix(climb.UnixTime)
        .format("MMM YYYY")
        .toString()

      const climbMonthAdded = result.find((r) => r.month === month)

      if (climbMonthAdded) {
        const climbIdx = gradeSystem.indexOf(climb.Grade)
        if (climb.Tick !== "Attempt") {
          if (climbMonthAdded.hardestClimbIdx > climbIdx) {
            return
          } else {
            climbMonthAdded.hardestClimbIdx = climbIdx
            climbMonthAdded.progressionLine = climbIdx
          }
        } else {
          if (climbMonthAdded.hardestAttemptIdx > climbIdx) {
            return
          } else {
            climbMonthAdded.hardestAttemptIdx = climbIdx
          }
        }

        // update the grade index for the y-axis range
        gradeMaxIndex = gradeMaxIndex < climbIdx ? climbIdx : gradeMaxIndex
      }
    })

    const firstBarIdx = result.findIndex((x) => x.progressionLine)

    result.forEach((obj, index) => {
      // calculate the hardestAttempts as the difference between hardestAttemptIdx and hardestClimbIdx
      const attemptValue = Math.max(
        0,
        obj.hardestAttemptIdx - obj.hardestClimbIdx
      )
      obj.hardestAttemptIdx = attemptValue

      // handle empty values after a bar
      if (
        index > 0 &&
        result[index - 1].hardestClimbIdx > obj.hardestClimbIdx
      ) {
        obj.progressionLine = result[index - 1].hardestClimbIdx
      } else if (index < result.length - 1) {
        // handle empty values before a bar
        if (
          result[index + 1].hardestClimbIdx > obj.hardestClimbIdx &&
          index > firstBarIdx
        ) {
          obj.progressionLine = result[index + 1].hardestClimbIdx
        }
      }
    })

    setGradeRange([0, gradeMaxIndex + 2])
    setGraphData(result)
  }

  if (promiseInProgress) {
    return <AppLoading />
  } else if (graphData.length <= 0) {
    return (
      <Typography
        fontFamily={"poppins"}
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
        <ComposedChart
          data={graphData}
          margin={{
            top: 20,
            right: 10,
            left: graphLeftMargin,
            bottom: 5,
          }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            domain={[0, graphXAxis.length - 1]}
            dataKey="monthIdx"
            fontSize={graphFontSize}
            tickFormatter={(tick) => {
              return graphXAxis[tick]
            }}
            scale={"auto"}
          />
          <YAxis
            type="number"
            domain={gradeRange}
            tickFormatter={(tick) => {
              return gradeSystem[tick]
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            stackId={"a"}
            type="monotone"
            dataKey="hardestClimbIdx"
            stroke="black"
            fill={AppColors.success}
          />
          <Bar
            stackId={"a"}
            type="monotone"
            dataKey="hardestAttemptIdx"
            stroke="black"
            fill={GraphColors.Attempts}
          />
          <Line
            type="bump"
            dataKey="progressionLine"
            fill="white"
            stroke="black"
            strokeWidth={3}
          />
        </ComposedChart>
      </ResponsiveContainer>
    )
  }
}

export default MonthlyClimbsGraph
