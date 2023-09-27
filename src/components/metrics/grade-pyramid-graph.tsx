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
import { ClimbLog, GradePyramidGraphData } from "../../types"
import { GraphColors } from "../../styles/styles"
import { Typography, useTheme } from "@mui/material"
import { useMediaQuery } from "@mui/material"
import { useUserContext } from "../../user-context"
import { GYM_CLIMB_TYPES } from "../../constants"
import { getGradePyramidGraphData } from "../../util/helper-functions"
import { usePromiseTracker } from "react-promise-tracker"
import AppLoading from "../common/app-loading"

export type GradeGraphProps = {
  climbType: number
  tickFilter: number
  dateFilter: number
}

function GradePyramid({ climbType, tickFilter, dateFilter }: GradeGraphProps) {
  const { promiseInProgress } = usePromiseTracker()
  const {
    userBoulderGradePyramidData,
    userLeadGradePyramidData,
    userTrGradePyramidData,
    userBoulderLogs,
    userLeadLogs,
    userTopRopeLogs,
    userClimbingLogs,
  } = useUserContext()
  const [graphData, setGraphData] = useState<GradePyramidGraphData[]>([])
  const theme = useTheme()
  const lgScreenAndUp = useMediaQuery(theme.breakpoints.up("lg"))
  const mdScreen = useMediaQuery(theme.breakpoints.only("md"))
  const graphAspectRatio = lgScreenAndUp ? 4 : mdScreen ? 3 : 2

  useEffect(() => {
    switch (climbType) {
      case GYM_CLIMB_TYPES.Boulder:
        setGraphData(
          userBoulderGradePyramidData ? userBoulderGradePyramidData : []
        )
        break
      case GYM_CLIMB_TYPES.Lead:
        setGraphData(userLeadGradePyramidData ? userLeadGradePyramidData : [])
        break
      case GYM_CLIMB_TYPES.TopRope:
        setGraphData(userTrGradePyramidData ? userTrGradePyramidData : [])
        break
    }
  }, [userClimbingLogs])

  useEffect(() => {
    const logsMapping: Record<GYM_CLIMB_TYPES, ClimbLog[]> = {
      [GYM_CLIMB_TYPES.Boulder]: userBoulderLogs || [],
      [GYM_CLIMB_TYPES.Lead]: userLeadLogs || [],
      [GYM_CLIMB_TYPES.TopRope]: userTopRopeLogs || [],
    }

    const formattedData = getGradePyramidGraphData(
      logsMapping[climbType as GYM_CLIMB_TYPES],
      climbType,
      tickFilter,
      dateFilter
    )
    setGraphData(formattedData)
  }, [tickFilter, dateFilter])

  console.log("pyramidGraph promiseInProgress", promiseInProgress)

  if (promiseInProgress) {
    return <AppLoading />
  } else {
    return graphData.length <= 0 ? (
      <Typography
        variant="h3"
        padding={10}
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        --
      </Typography>
    ) : (
      <ResponsiveContainer aspect={graphAspectRatio}>
        <BarChart
          layout="vertical"
          data={graphData}
          barSize={30}
          //style={{ marginLeft: -20 }}
        >
          <XAxis type="number" />
          <YAxis
            type="category"
            tickCount={graphData.length}
            dataKey="Grade"
            tickLine={false}
            fontSize={12}
          />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
          <Bar dataKey="Onsight" stackId="a" fill={GraphColors.Onsight} />
          <Bar dataKey="Flash" stackId="a" fill={GraphColors.Flash} />
          <Bar dataKey="Redpoint" stackId="a" fill={GraphColors.Redpoint} />
          <Bar dataKey="Attempts" stackId="a" fill={GraphColors.Attempts} />
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

export default GradePyramid
