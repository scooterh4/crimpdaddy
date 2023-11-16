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
import {
  BoulderGradePyramidGraphData,
  ClimbLog,
  ClimbingSessionData,
  RouteGradePyramidGraphData,
} from "../../../static/types"
import { GraphColors } from "../../../static/styles"
import { Card, Grid, Typography, useTheme } from "@mui/material"
import { useMediaQuery } from "@mui/material"
import { useUserContext } from "../protected-context"
import { GYM_CLIMB_TYPES, PromiseTrackerArea } from "../../../static/constants"
import { assembleGradePyramidGraphData } from "../../../util/data-helper-functions"
import { usePromiseTracker } from "react-promise-tracker"
import AppLoading from "../../common/loading"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"
import { Square } from "@mui/icons-material"

type Props = {
  climbType: number
  tickFilter?: number
  dateFilter?: number
  sessionData?: ClimbLog[]
}

export default function GradePyramid({
  climbType,
  tickFilter,
  dateFilter,
  sessionData,
}: Props) {
  const { promiseInProgress } = usePromiseTracker({
    area: PromiseTrackerArea.GradePyramidGraph,
  })
  const { userBoulderLogs, userLeadLogs, userTopRopeLogs } = useUserContext()
  const [graphData, setGraphData] = useState<
    BoulderGradePyramidGraphData[] | RouteGradePyramidGraphData[]
  >([])
  const theme = useTheme()
  const lgScreenAndUp = useMediaQuery(theme.breakpoints.up("lg"))
  const mdScreen = useMediaQuery(theme.breakpoints.only("md"))
  const graphAspectRatio = lgScreenAndUp ? 4 : mdScreen ? 3 : 2

  useEffect(() => {
    let formattedData:
      | BoulderGradePyramidGraphData[]
      | RouteGradePyramidGraphData[] = []

    if (sessionData) {
      formattedData = assembleGradePyramidGraphData(
        sessionData,
        climbType,
        tickFilter,
        dateFilter
      )
    } else {
      const logsMapping: Record<GYM_CLIMB_TYPES, ClimbLog[]> = {
        [GYM_CLIMB_TYPES.Boulder]: userBoulderLogs || [],
        [GYM_CLIMB_TYPES.Lead]: userLeadLogs || [],
        [GYM_CLIMB_TYPES.TopRope]: userTopRopeLogs || [],
      }

      formattedData = assembleGradePyramidGraphData(
        logsMapping[climbType as GYM_CLIMB_TYPES],
        climbType,
        tickFilter,
        dateFilter
      )
    }

    climbType === GYM_CLIMB_TYPES.Boulder
      ? setGraphData(formattedData as BoulderGradePyramidGraphData[])
      : setGraphData(formattedData as RouteGradePyramidGraphData[])
  }, [tickFilter, dateFilter])

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

    const onsight = payload.find((p) => p.dataKey === "onsight")
    const flash = payload.find((p) => p.dataKey === "flash")
    const redpoint = payload.find((p) => p.dataKey === "redpoint")
    const sends = payload.find((p) => p.dataKey === "sends")
    const attempts = payload.find((p) => p.dataKey === "attempts")

    return (
      <Card sx={{ fontFamily: "poppins", padding: 2 }}>
        <Typography
          component="div"
          fontWeight={"bold"}
          gutterBottom
          textAlign={"center"}
        >
          {label}
        </Typography>

        {onsight && (
          <Grid
            container
            direction={"row"}
            item
            justifyContent={"center"}
            sx={{ display: "flex" }}
          >
            <Square sx={{ color: GraphColors.Onsight }} />
            <Typography component="div">
              Onsight: <b>{onsight.value}</b>
            </Typography>
          </Grid>
        )}

        {flash && (
          <Grid
            container
            direction={"row"}
            item
            justifyContent={"center"}
            sx={{ display: "flex" }}
          >
            <Square sx={{ color: GraphColors.Flash }} />
            <Typography component="div">
              Flash: <b>{flash.value}</b>
            </Typography>
          </Grid>
        )}

        {redpoint && (
          <Grid
            container
            direction={"row"}
            item
            justifyContent={"center"}
            sx={{ display: "flex" }}
          >
            <Square sx={{ color: GraphColors.Redpoint }} />
            <Typography component="div">
              Redpoint: <b>{redpoint.value}</b>
            </Typography>
          </Grid>
        )}

        {sends && (
          <Grid
            container
            direction={"row"}
            item
            justifyContent={"center"}
            sx={{ display: "flex" }}
          >
            <Square sx={{ color: GraphColors.Sends }} />
            <Typography component="div">
              Sends: <b>{sends.value}</b>
            </Typography>
          </Grid>
        )}

        {attempts && (
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
        <Tooltip content={<CustomTooltip />} />
        <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
        <Bar dataKey="onsight" stackId="a" fill={GraphColors.Onsight} />
        <Bar dataKey="flash" stackId="a" fill={GraphColors.Flash} />
        <Bar dataKey="sends" stackId="a" fill={GraphColors.Sends} />
        <Bar dataKey="redpoint" stackId="a" fill={GraphColors.Redpoint} />
        <Bar dataKey="attempts" stackId="a" fill={GraphColors.Attempts} />
      </BarChart>
    </ResponsiveContainer>
  )
}
