import { Box, Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import SectionLegend from "../common/section-legend"
import GradePyramid from "./grade-pyramid-graph"
import { ThemeColors, drawerWidth } from "../../static/styles"
import { useUserContext } from "../context/user-context"
import AppToolbar from "../common/toolbar"
import AppLoading from "../common/loading"
import AppFooter from "../common/footer"
import {
  DateFilters,
  GYM_CLIMB_TYPES,
  PromiseTrackerArea,
} from "../../static/constants"
import SelectFilter from "../common/select-filter"
import { usePromiseTracker } from "react-promise-tracker"

enum GradePyramidFilter {
  AttemptsAndClimbs,
  AttemptsOnly,
  ClimbsOnly,
}

export default function GradePyramidPage() {
  const { dataDateRange, updateDateRange } = useUserContext()
  const { promiseInProgress } = usePromiseTracker({
    area: PromiseTrackerArea.GradePyramids,
  })
  const [dateFilter, setDateFilter] = useState<number>(DateFilters.Last6Months)
  const [gradePyramidFilter, setGradePyramidFilter] = useState<number>(
    GradePyramidFilter.AttemptsAndClimbs
  )

  useEffect(() => {
    if (!dataDateRange || dataDateRange < DateFilters.Last6Months) {
      updateDateRange(DateFilters.Last6Months, PromiseTrackerArea.GradePyramids)
    }
  }, [])

  return promiseInProgress ? (
    <>
      <Box
        minHeight={"94.2vh"}
        sx={{ backgroundColor: ThemeColors.backgroundColor, display: "flex" }}
      >
        <AppToolbar title="Dashboard" />

        <Box
          component="main"
          flexDirection={"column"}
          sx={{
            width: { lg: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
          }}
        >
          <AppLoading />
        </Box>
      </Box>
      <AppFooter isAuthenticated={true} />
    </>
  ) : (
    <>
      <Box
        minHeight={"94.2vh"}
        marginBottom={2}
        sx={{ backgroundColor: ThemeColors.backgroundColor, display: "flex" }}
      >
        <AppToolbar title="Dashboard" />

        <Box
          component="main"
          marginTop={5}
          sx={{
            flexGrow: 1,
            p: 3,
            width: { lg: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
          }}
        >
          <Grid
            container
            direction={"row"}
            alignContent={"center"}
            marginBottom={5}
          >
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
                Grade Pyramids
              </Typography>
            </Grid>

            <Grid container item direction={"row"} justifyContent={"center"}>
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

            <Grid container direction={"row"} marginTop={2}>
              <SectionLegend section="gradePyramids" />
            </Grid>
          </Grid>

          <Grid container direction={"row"}>
            <Grid
              alignItems={"center"}
              border={1}
              borderColor={ThemeColors.darkShade}
              borderRadius={2}
              container
              direction={"column"}
              gridAutoRows="auto"
              sx={{ backgroundColor: "white" }}
            >
              <Typography
                fontFamily={"poppins"}
                gridRow={1}
                padding={2}
                variant="h5"
                sx={{ textAlign: "center" }}
              >
                Bouldering
              </Typography>

              <GradePyramid
                climbType={GYM_CLIMB_TYPES.Boulder}
                tickFilter={gradePyramidFilter}
                dateFilter={dateFilter}
              />
            </Grid>

            <Grid
              alignItems={"center"}
              border={1}
              borderColor={ThemeColors.darkShade}
              borderRadius={2}
              container
              direction={"column"}
              gridAutoRows="auto"
              marginBottom={5}
              marginTop={5}
              sx={{ backgroundColor: "white" }}
            >
              <Typography
                fontFamily={"poppins"}
                gridRow={1}
                padding={2}
                variant="h5"
                sx={{ textAlign: "center" }}
              >
                Lead
              </Typography>

              <GradePyramid
                climbType={GYM_CLIMB_TYPES.Lead}
                tickFilter={gradePyramidFilter}
                dateFilter={dateFilter}
              />
            </Grid>

            <Grid
              alignItems={"center"}
              border={1}
              borderColor={ThemeColors.darkShade}
              borderRadius={2}
              container
              direction={"column"}
              gridAutoRows="auto"
              sx={{ backgroundColor: "white" }}
            >
              <Typography
                fontFamily={"poppins"}
                gridRow={1}
                padding={2}
                variant="h5"
                sx={{ textAlign: "center" }}
              >
                Top Rope
              </Typography>

              <GradePyramid
                climbType={GYM_CLIMB_TYPES.TopRope}
                tickFilter={gradePyramidFilter}
                dateFilter={dateFilter}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <AppFooter isAuthenticated={true} />
    </>
  )
}
