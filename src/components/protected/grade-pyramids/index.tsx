import { Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import SectionLegend from "../common/section-legend"
import GradePyramid from "./grade-pyramid-graph"
import { ThemeColors } from "../../../static/styles"
import AppLoading from "../../common/loading"
import {
  DateFilters,
  GradePyramidFilter,
  PromiseTrackerArea,
} from "../../../static/constants"
import SelectFilter from "../common/select-filter"
import { trackPromise, usePromiseTracker } from "react-promise-tracker"
import {
  useDataDateRangeContext,
  useProtectedAPI,
  useUserClimbingDataContext,
} from "../context/protected-context"
import { useAuthContext } from "../../app/context/auth-context"
import { getAllUserClimbingData } from "../../../utils/db"
import moment from "moment"
import { ClimbLog } from "../../../static/types"

export default function GradePyramidPage() {
  const { user } = useAuthContext()
  const {
    onUpdateUserClimbingData,
    onUpdateDataLastRead,
    onUpdateDataDateRange,
  } = useProtectedAPI()
  const climbingData = useUserClimbingDataContext()
  const dataDateRange = useDataDateRangeContext()
  const { promiseInProgress } = usePromiseTracker({
    area: PromiseTrackerArea.GradePyramids,
  })
  const [dateFilter, setDateFilter] = useState<string>(DateFilters.ThisMonth)
  const [gradePyramidFilter, setGradePyramidFilter] = useState<string>(
    GradePyramidFilter.ClimbsOnly
  )

  // setup data to display
  const gradePyramidData: { title: string; data: ClimbLog[] }[] = []

  if (climbingData && climbingData.boulderLogs.length > 0)
    gradePyramidData.push({
      title: "Bouldering",
      data: climbingData.boulderLogs,
    })
  if (climbingData && climbingData.leadLogs.length > 0)
    gradePyramidData.push({ title: "Lead", data: climbingData.leadLogs })
  if (climbingData && climbingData.topRopeLogs.length > 0)
    gradePyramidData.push({ title: "Top Rope", data: climbingData.topRopeLogs })

  useEffect(() => {
    if (user) {
      if (
        !dataDateRange ||
        Object.keys(DateFilters).indexOf(dateFilter) >
          Object.keys(DateFilters).indexOf(dataDateRange)
      ) {
        trackPromise(
          getAllUserClimbingData(user.id, dateFilter).then((res) => {
            onUpdateUserClimbingData(res)
            onUpdateDataDateRange(dateFilter)
            onUpdateDataLastRead(moment().unix())
          }),
          PromiseTrackerArea.GradePyramidGraph
        )
      }
    }
  }, [user, dateFilter])

  return !user || promiseInProgress ? (
    <AppLoading />
  ) : (
    <>
      <Grid container direction={"row"} alignContent={"center"}>
        <Grid container item direction={"row"}>
          <Typography
            color={ThemeColors.darkShade}
            fontFamily={"poppins"}
            gutterBottom
            gridColumn={"1"}
            justifySelf={"start"}
            paddingTop={2}
            variant="h3"
          >
            Grade Pyramids
          </Typography>
        </Grid>

        {gradePyramidData.length === 0 && (
          <Typography>No data to display.</Typography>
        )}

        {gradePyramidData.length > 0 && (
          <>
            <Grid
              container
              item
              direction={"row"}
              justifyContent={"center"}
              marginBottom={2}
            >
              <SelectFilter
                graph={PromiseTrackerArea.GradePyramidGraph}
                dateFilter={true}
                setFilter={setDateFilter}
              />
              <SelectFilter
                graph={PromiseTrackerArea.GradePyramidGraph}
                dateFilter={false}
                setFilter={setGradePyramidFilter}
              />
            </Grid>

            {gradePyramidData.map((pyramid, index) => (
              <Grid
                alignItems={"center"}
                border={1}
                borderColor={ThemeColors.darkShade}
                borderRadius={2}
                container
                direction={"column"}
                gridAutoRows="auto"
                key={pyramid.title}
                marginBottom={1}
                marginTop={1}
                paddingBottom={2}
                paddingTop={2}
                sx={{ backgroundColor: "white" }}
              >
                <Typography
                  fontFamily={"poppins"}
                  gridRow={1}
                  variant="h5"
                  sx={{ textAlign: "center" }}
                >
                  {pyramid.title}
                </Typography>

                <Grid
                  item
                  container
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  marginBottom={2}
                  marginLeft={-5}
                  marginTop={2}
                >
                  <GradePyramid
                    data={pyramid.data}
                    climbType={index}
                    tickFilter={gradePyramidFilter}
                    dateFilter={dateFilter}
                  />
                </Grid>

                <SectionLegend section="gradePyramids" climbType={index} />
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </>
  )
}
