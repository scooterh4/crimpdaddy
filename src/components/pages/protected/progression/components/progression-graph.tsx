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
import { ClimbLog, ProgressionGraphData } from "../../../../../static/types"
import { Box, Card, Grid, Typography, useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import {
  CLIMB_TYPES,
  PromiseTrackerArea,
} from "../../../../../static/constants"
import {
  BOULDER_GRADES,
  INDOOR_SPORT_GRADES,
} from "../../../../../static/constants"
import { AppFont, GraphColors } from "../../../../../static/styles"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"
import AppLoading from "../../../../common/loading"
import { trackPromise, usePromiseTracker } from "react-promise-tracker"
import { Square } from "@mui/icons-material"
import { formatDataForProgressionGraph } from "../utils/data-helper-functions"

type Props = {
  data: ClimbLog[]
  climbType: number
  filter: string
}

export default function MonthlyClimbsGraph({ data, climbType, filter }: Props) {
  const { promiseInProgress } = usePromiseTracker({
    area: PromiseTrackerArea.ProgressionGraph,
  })
  const [graphData, setGraphData] = useState<ProgressionGraphData[]>([])
  const [gradeRange, setGradeRange] = useState<number[]>([])
  const [graphXAxis, setGraphXAxis] = useState<string[]>([])
  const gradeSystem =
    climbType === CLIMB_TYPES.Boulder ? BOULDER_GRADES : INDOOR_SPORT_GRADES

  const theme = useTheme()
  const lgScreenAndUp = useMediaQuery(theme.breakpoints.up("lg"))
  const mdScreenAndUp = useMediaQuery(theme.breakpoints.up("md"))
  const mdScreenOnly = useMediaQuery(theme.breakpoints.only("md"))
  const smScreenOnly = useMediaQuery(theme.breakpoints.only("sm"))
  const graphAspectRatio = lgScreenAndUp ? 4 : mdScreenOnly ? 3 : 2
  const graphLeftMargin = climbType === CLIMB_TYPES.Boulder ? -20 : -10
  const graphFontSize = mdScreenAndUp || smScreenOnly ? 14 : 11

  useEffect(() => {
    trackPromise(
      formatDataForProgressionGraph(data, filter, gradeSystem).then((res) => {
        setGradeRange(res.gradeRange)
        setGraphData(res.graphData)
        setGraphXAxis(res.xAxis)
      }),
      PromiseTrackerArea.ProgressionGraph
    )
  }, [filter])

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

    return (
      <Card sx={{ fontFamily: AppFont, padding: 2 }}>
        <Typography
          component="div"
          fontWeight={"bold"}
          gutterBottom
          textAlign={"center"}
        >
          {`${graphXAxis[label]}`}
        </Typography>

        {gradeSystem[graphData[label].hardestClimbIdx] === "" && (
          <Typography component="div" textAlign={"center"}>
            --
          </Typography>
        )}

        {gradeSystem[graphData[label].hardestClimbIdx] !== "" && (
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
                Highest grade climbed:{" "}
                <Box fontWeight="bold" display="inline">
                  {`${gradeSystem[graphData[label].hardestClimbIdx]}`}
                </Box>
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
            </Grid>
          </>
        )}
      </Card>
    )
  }

  if (promiseInProgress) {
    return (
      <Grid container direction={"column"} justifyContent={"center"}>
        <AppLoading />
      </Grid>
    )
  }
  return (
    <Grid
      container
      item
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
    >
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
            fill={GraphColors.Sends}
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
    </Grid>
  )
}