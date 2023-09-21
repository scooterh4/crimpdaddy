import { Box, Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import SectionLegend from "../components/metrics/section-legend"
import GradePyramid from "../components/metrics/grade-pyramid-graph"
import { AppColors, ThemeColors, drawerWidth } from "../styles/styles"
import { useUserContext } from "../user-context"
import AppToolbar from "../components/common/app-toolbar"
import AppLoading from "../components/common/app-loading"
import AppFooter from "../components/common/app-footer"
import { DateFilters, GYM_CLIMB_TYPES } from "../constants"
import SelectFilter from "../components/metrics/select-filter"

enum GradePyramidFilter {
  AttemptsAndClimbs,
  AttemptsOnly,
  ClimbsOnly,
}

function GradePyramidPage() {
  const {
    dataDateRange,
    updateDateRange,
    userClimbingLogs,
    userBoulderGradePyramidData,
    userLeadGradePyramidData,
    userTrGradePyramidData,
  } = useUserContext()
  const [dateFilter, setDateFilter] = useState<number>(DateFilters.Last6Months)
  const [gradePyramidFilter, setGradePyramidFilter] = useState<number>(
    GradePyramidFilter.AttemptsAndClimbs
  )

  useEffect(() => {
    if (!dataDateRange || dataDateRange < DateFilters.Last6Months) {
      updateDateRange(DateFilters.Last6Months)
    }
  }, [])

  return !userClimbingLogs ? (
    <>
      <Box minHeight={"94.2vh"} sx={{ display: "flex" }}>
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
      <AppFooter />
    </>
  ) : (
    <>
      <Box minHeight={"94.2vh"} sx={{ display: "flex" }}>
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
            marginBottom={2}
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
                page="gradePyramids"
                dateFilter={true}
                selectedFilter={dateFilter}
                setFilter={setDateFilter}
              />
              <SelectFilter
                dateFilter={false}
                page="gradePyramids"
                selectedFilter={gradePyramidFilter}
                setFilter={setGradePyramidFilter}
              />
            </Grid>
          </Grid>

          <Grid container direction={"row"} marginBottom={2}>
            <SectionLegend section="gradePyramids" />
          </Grid>

          <Grid container direction={"row"}>
            <Grid
              alignItems={"center"}
              border={1}
              borderColor={AppColors.primary}
              borderRadius={5}
              container
              direction={"column"}
              gridAutoRows="auto"
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

              <Grid
                container
                item
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                marginLeft={
                  userBoulderGradePyramidData
                    ? userBoulderGradePyramidData.length > 0
                      ? -5
                      : 0
                    : 0
                }
              >
                <GradePyramid
                  climbType={GYM_CLIMB_TYPES.Boulder}
                  tickFilter={gradePyramidFilter}
                  dateFilter={dateFilter}
                />
              </Grid>
            </Grid>

            <Grid
              alignItems={"center"}
              border={1}
              borderColor={AppColors.primary}
              borderRadius={5}
              container
              direction={"column"}
              gridAutoRows="auto"
              marginBottom={5}
              marginTop={5}
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

              <Grid
                container
                item
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                marginLeft={
                  userLeadGradePyramidData
                    ? userLeadGradePyramidData.length > 0
                      ? -5
                      : 0
                    : 0
                }
              >
                <GradePyramid
                  climbType={GYM_CLIMB_TYPES.Lead}
                  tickFilter={gradePyramidFilter}
                  dateFilter={dateFilter}
                />
              </Grid>
            </Grid>

            <Grid
              alignItems={"center"}
              border={1}
              borderColor={AppColors.primary}
              borderRadius={5}
              container
              direction={"column"}
              gridAutoRows="auto"
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

              <Grid
                container
                item
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                marginLeft={
                  userTrGradePyramidData
                    ? userTrGradePyramidData.length > 0
                      ? -5
                      : 0
                    : 0
                }
              >
                <GradePyramid
                  climbType={GYM_CLIMB_TYPES.TopRope}
                  tickFilter={gradePyramidFilter}
                  dateFilter={dateFilter}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <AppFooter />
    </>
  )
}

export default GradePyramidPage
