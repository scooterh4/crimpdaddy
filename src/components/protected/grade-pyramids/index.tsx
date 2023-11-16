import { Grid, Typography } from "@mui/material"
import React, { useMemo, useState } from "react"
import SectionLegend from "../common/section-legend"
import GradePyramid from "./grade-pyramid-graph"
import { ThemeColors } from "../../../static/styles"
import { useUserContext } from "../protected-context"
import AppLoading from "../../common/loading"
import {
  DateFilters,
  GradePyramidFilter,
  PromiseTrackerArea,
} from "../../../static/constants"
import SelectFilter from "../common/select-filter"
import { usePromiseTracker } from "react-promise-tracker"

export default function GradePyramidPage() {
  const { dataDateRange, updateDateRange } = useUserContext()
  const { promiseInProgress } = usePromiseTracker({
    area: PromiseTrackerArea.GradePyramids,
  })
  const [dateFilter, setDateFilter] = useState<string>(DateFilters.ThisMonth)
  const [gradePyramidFilter, setGradePyramidFilter] = useState<string>(
    GradePyramidFilter.ClimbsOnly
  )
  const { userBoulderLogs, userLeadLogs, userTopRopeLogs } = useUserContext()

  // setup titles for displaying data
  const titles: string[] = []
  if (userBoulderLogs && userBoulderLogs.length > 0) titles.push("Bouldering")
  if (userLeadLogs && userLeadLogs.length > 0) titles.push("Lead")
  if (userTopRopeLogs && userTopRopeLogs.length > 0) titles.push("Top Rope")

  useMemo(() => {
    if (
      !dataDateRange ||
      Object.keys(DateFilters).indexOf(dataDateRange) <
        Object.keys(DateFilters).indexOf(dateFilter)
    ) {
      updateDateRange(dateFilter, PromiseTrackerArea.GradePyramids)
    }
  }, [])

  return promiseInProgress ? (
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

        {titles.length === 0 && <Typography>No data to display.</Typography>}

        {titles.length > 0 && (
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

            {titles.map((title, index) => (
              <Grid
                alignItems={"center"}
                border={1}
                borderColor={ThemeColors.darkShade}
                borderRadius={2}
                container
                direction={"column"}
                gridAutoRows="auto"
                key={title}
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
                  {title}
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
