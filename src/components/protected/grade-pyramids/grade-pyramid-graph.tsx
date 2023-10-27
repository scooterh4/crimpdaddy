import React, { useEffect, useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ClimbLog, GradePyramidGraphData } from "../../../static/types"
import { GraphColors } from "../../../static/styles"
import { Grid, Typography, useTheme } from "@mui/material"
import { useMediaQuery } from "@mui/material"
import { useUserContext } from "../protected-context"
import { GYM_CLIMB_TYPES, PromiseTrackerArea } from "../../../static/constants"
import { assembleGradePyramidGraphData } from "../../../util/data-helper-functions"
import { usePromiseTracker } from "react-promise-tracker"
import AppLoading from "../../common/loading"

type Props = {
  climbType: number
  tickFilter: number
  dateFilter: number
}

export default function GradePyramid({
  climbType,
  tickFilter,
  dateFilter,
}: Props) {
  const { promiseInProgress } = usePromiseTracker({
    area: PromiseTrackerArea.GradePyramidGraph,
  })
  const {
    userBoulderGradePyramidData,
    userLeadGradePyramidData,
    userTrGradePyramidData,
    userBoulderLogs,
    userLeadLogs,
    userTopRopeLogs,
    // userClimbingLogs,
  } = useUserContext()
  const [graphData, setGraphData] = useState<GradePyramidGraphData[]>([])
  const theme = useTheme()
  const lgScreenAndUp = useMediaQuery(theme.breakpoints.up("lg"))
  const mdScreen = useMediaQuery(theme.breakpoints.only("md"))
  const graphAspectRatio = lgScreenAndUp ? 4 : mdScreen ? 3 : 2

  useMemo(() => {
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
  }, [])

  useEffect(() => {
    const logsMapping: Record<GYM_CLIMB_TYPES, ClimbLog[]> = {
      [GYM_CLIMB_TYPES.Boulder]: userBoulderLogs || [],
      [GYM_CLIMB_TYPES.Lead]: userLeadLogs || [],
      [GYM_CLIMB_TYPES.TopRope]: userTopRopeLogs || [],
    }

    const formattedData = assembleGradePyramidGraphData(
      logsMapping[climbType as GYM_CLIMB_TYPES],
      climbType,
      tickFilter,
      dateFilter
    )

    setGraphData(formattedData)
  }, [tickFilter, dateFilter])

  if (promiseInProgress) {
    return (
      <Grid container direction={"column"} justifyContent={"center"}>
        <AppLoading />
      </Grid>
    )
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
      <Grid
        container
        item
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        marginLeft={-5}
      >
        <ResponsiveContainer aspect={graphAspectRatio}>
          <BarChart layout="vertical" data={graphData} barSize={30}>
            <XAxis type="number" allowDecimals={false} tickLine={false} />
            <YAxis
              type="category"
              tickCount={graphData.length}
              dataKey="grade"
              tickLine={false}
              fontSize={12}
            />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
            <Bar dataKey="onsight" stackId="a" fill={GraphColors.Onsight} />
            <Bar dataKey="flash" stackId="a" fill={GraphColors.Flash} />
            <Bar dataKey="redpoint" stackId="a" fill={GraphColors.Redpoint} />
            <Bar dataKey="attempts" stackId="a" fill={GraphColors.Attempts} />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    )
  }
}
