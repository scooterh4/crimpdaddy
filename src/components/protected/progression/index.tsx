import { Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { DateFilters, PromiseTrackerArea } from "../../../static/constants"
import { ThemeColors } from "../../../static/styles"
import AppLoading from "../../common/loading"
import SelectFilter from "../common/select-filter"
import ProgressionGraph from "./progression-graph"
import { trackPromise, usePromiseTracker } from "react-promise-tracker"
import SectionLegend from "../common/section-legend"
import {
  useDataDateRangeContext,
  useProtectedAPI,
  useUserClimbingDataContext,
} from "../context/protected-context"
import { useAuthContext } from "../../app/context/auth-context"
import { ClimbLog } from "../../../static/types"
import { getAllUserClimbingData } from "../../../util/db"
import moment from "moment"

export default function ProgressionPage() {
  const { user } = useAuthContext()
  const {
    onUpdateUserClimbingData,
    onUpdateDataLastRead,
    onUpdateDataDateRange,
  } = useProtectedAPI()
  const climbingData = useUserClimbingDataContext()
  const dataDateRange = useDataDateRangeContext()
  const { promiseInProgress } = usePromiseTracker({
    area: PromiseTrackerArea.Progression,
  })
  const [dateFilter, setDateFilter] = useState<string>(DateFilters.Last6Months)
  // const [progressionData, setProgressionData] = useState<
  //   { title: string; data: ClimbLog[] }[]
  // >([])

  function updateProgressionData() {
    // let data = []
    // // if (climbingData && climbingData.boulderLogs.length > 0)
    // //   data.push({
    // //     title: "Bouldering",
    // //     data: climbingData.boulderLogs,
    // //   })
    // // if (climbingData && climbingData.leadLogs.length > 0)
    // //   data.push({ title: "Lead", data: climbingData.leadLogs })
    // // if (climbingData && climbingData.topRopeLogs.length > 0)
    // //   data.push({ title: "Top Rope", data: climbingData.topRopeLogs })
    // setProgressionData(data)
  }

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
            updateProgressionData()
          }),
          PromiseTrackerArea.Progression
        )
      } else {
        console.log("updating prog data")
        updateProgressionData
      }
    }
  }, [user, dateFilter])

  let progressionData = []

  if (climbingData && climbingData.boulderLogs.length > 0)
    progressionData.push({
      title: "Bouldering",
      data: climbingData.boulderLogs,
    })
  if (climbingData && climbingData.leadLogs.length > 0)
    progressionData.push({ title: "Lead", data: climbingData.leadLogs })
  if (climbingData && climbingData.topRopeLogs.length > 0)
    progressionData.push({ title: "Top Rope", data: climbingData.topRopeLogs })

  console.log("progressionData on render", progressionData)

  return !user && promiseInProgress ? (
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
            paddingLeft={0}
            paddingTop={2}
            variant="h3"
            sx={{ columnSpan: "2" }}
          >
            Progression
          </Typography>
        </Grid>

        {!promiseInProgress && progressionData.length === 0 && (
          <Typography>No data to display.</Typography>
        )}

        {progressionData.length > 0 && (
          <>
            <Grid
              container
              item
              direction={"row"}
              justifyContent={"center"}
              marginBottom={2}
            >
              <SelectFilter
                graph={PromiseTrackerArea.ProgressionGraph}
                dateFilter={true}
                setFilter={setDateFilter}
              />
            </Grid>

            {progressionData.map((graph, index) => (
              <Grid
                alignItems={"center"}
                border={1}
                borderColor={ThemeColors.darkShade}
                borderRadius={2}
                container
                direction={"column"}
                gridAutoRows="auto"
                key={graph.title}
                marginBottom={1}
                marginTop={1}
                padding={2}
                sx={{ backgroundColor: "white" }}
              >
                <Typography
                  fontFamily={"poppins"}
                  gridRow={1}
                  variant="h5"
                  sx={{ textAlign: "center" }}
                >
                  {graph.title}
                </Typography>

                <ProgressionGraph
                  data={graph.data}
                  climbType={index}
                  filter={dateFilter}
                />

                <SectionLegend section="progression" />
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </>
  )
}
