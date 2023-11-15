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
import { GraphColors } from "../../../static/styles"
import { ClimbLog, ClimbingSessionData } from "../../../static/types"
import { Box, Card, Typography, useTheme } from "@mui/material"
import { useMediaQuery } from "@mui/material"
import moment, { Moment } from "moment"
import {
  BOULDER_GRADES,
  GYM_CLIMB_TYPES,
  INDOOR_SPORT_GRADES,
} from "../../../static/constants"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

type Props = {
  data: ClimbingSessionData
  climbType: string
}

type ClimbsInSession = {
  climbGradeIndex: number
  attemptGradeIndex: number
  failedAttemptCount: number
  unixTime: number
  time: string
}

export default function SessionGraph({ data, climbType }: Props) {
  const [graphData, setGraphData] = useState<ClimbsInSession[]>([])
  const [gradeRange, setGradeRange] = useState<number[]>([])
  const gradeSystem =
    climbType === GYM_CLIMB_TYPES[0] ? BOULDER_GRADES : INDOOR_SPORT_GRADES
  const theme = useTheme()
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const smScreenOnly = useMediaQuery(theme.breakpoints.only("sm"))
  const graphAspectRatio = mdScreenAndUp ? 5 : smScreenOnly ? 2.5 : 2

  useEffect(() => {
    if (data) {
      filterRawClimbingData(data.climbs)
    }
  }, [data])

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active) {
      const data = graphData.find((g) => g.time === label)
      if (data) {
        if (
          data.attemptGradeIndex === 0 &&
          data.climbGradeIndex === 0 &&
          data.failedAttemptCount === 0
        ) {
          return (
            <Card
              sx={{
                fontFamily: "poppins",
                padding: 2,
              }}
            >
              <Typography
                component="div"
                fontWeight={"bold"}
                textAlign={"center"}
              >
                {label}
              </Typography>
              <Typography component="div" textAlign={"center"}>
                --
              </Typography>
            </Card>
          )
        }
        if (payload) {
          return (
            <Card sx={{ fontFamily: "poppins", padding: 2 }}>
              <Typography
                component="div"
                fontWeight={"bold"}
                textAlign={"center"}
                marginBottom={1}
              >
                {label}
              </Typography>
              <Typography component="div">
                Grade climbed:{" "}
                <Box fontWeight="bold" display="inline">
                  {`${gradeSystem[data.climbGradeIndex]}`}
                </Box>
              </Typography>
              <Typography component="div">
                Failed attempts:{" "}
                <Box fontWeight="bold" display="inline">
                  {data.failedAttemptCount > 0 && `${data.failedAttemptCount}`}
                </Box>
              </Typography>
              <Typography component="div">
                Grade of failed attempts:{" "}
                <Box fontWeight="bold" display="inline">
                  {data.failedAttemptCount > 0 &&
                    `${
                      gradeSystem[data.climbGradeIndex + data.attemptGradeIndex]
                    }`}
                </Box>
              </Typography>
            </Card>
          )
        }
      }
    }
    return null
  }

  function filterRawClimbingData(climbs: ClimbLog[]): void {
    const sortedClimbs = climbs.sort((a, b) => a.unixTime - b.unixTime)
    let result = setResultDates(
      moment.unix(data.sessionMetadata.sessionStart.seconds),
      moment.unix(data.sessionMetadata.sessionEnd.seconds)
    )
    // for the y-axis range
    let gradeMaxIndex = 0

    sortedClimbs.forEach((climb) => {
      if (
        (climbType === "Boulder" && climb.climbType !== "Boulder") ||
        (climbType === "Routes" && climb.climbType === "Boulder")
      ) {
        return
      }
      const time = moment
        .unix(climb.unixTime)
        .format("h:mm a")
        .toString()

      const value = result.find((r) => r.time === time)
      const climbIdx = gradeSystem.indexOf(climb.grade)

      if (value) {
        if (climb.tick === "Attempt") {
          value.attemptGradeIndex = climbIdx
          value.failedAttemptCount = climb.count
        } else {
          value.climbGradeIndex = climbIdx
        }
      } else {
        result.push({
          climbGradeIndex: climb.tick !== "Attempt" ? climbIdx : 0,
          attemptGradeIndex: climb.tick === "Attempt" ? climbIdx : 0,
          failedAttemptCount: climb.tick === "Attempt" ? climb.count : 0,
          unixTime: climb.unixTime,
          time: moment
            .unix(climb.unixTime)
            .format("h:mm a")
            .toString(),
        })
      }
      // update the grade index for the y-axis range
      gradeMaxIndex = gradeMaxIndex < climbIdx ? climbIdx : gradeMaxIndex
    })

    // calculate the attemptGradeIndex as the difference between attemptGradeIndex and climbGradeIndex
    result.forEach((obj) => {
      if (obj.attemptGradeIndex === 0 && obj.climbGradeIndex === 0) return

      const attemptValue = Math.max(
        0,
        obj.attemptGradeIndex - obj.climbGradeIndex
      )
      obj.attemptGradeIndex = attemptValue
    })

    result.sort((a, b) => a.unixTime - b.unixTime)
    setGradeRange([0, gradeMaxIndex + 2])
    setGraphData(result)
  }

  function setResultDates(
    startMoment: Moment,
    endMoment: Moment
  ): ClimbsInSession[] {
    let result: ClimbsInSession[] = []
    let minMoment = startMoment.clone()

    while (minMoment <= endMoment) {
      result.push({
        climbGradeIndex: 0,
        attemptGradeIndex: 0,
        failedAttemptCount: 0,
        time: minMoment.format("h:mm a").toString(),
        unixTime: minMoment.unix(),
      })

      minMoment.add(1, "minutes")
    }

    return result
  }

  // if (promiseInProgress) {
  //   return <AppLoading />
  // }

  return (
    <ResponsiveContainer aspect={graphAspectRatio}>
      <BarChart
        data={graphData}
        margin={{
          top: 20,
          right: 10,
          left: -10,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="category" dataKey="time" />
        <YAxis
          type="number"
          domain={gradeRange}
          tickFormatter={(tick) => {
            return gradeSystem[tick]
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="climbGradeIndex" stackId="a" fill={GraphColors.Sends} />
        <Bar
          dataKey="attemptGradeIndex"
          stackId="a"
          fill={GraphColors.Attempts}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
