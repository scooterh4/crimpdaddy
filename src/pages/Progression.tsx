import { Box, Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useUserContext } from "../context-api"
import { DateFilters, GYM_CLIMB_TYPES } from "../constants"
import AppToolbar from "../components/common/app-toolbar"
import { AppColors, ThemeColors, drawerWidth } from "../styles/styles"
import AppLoading from "../components/common/app-loading"
import AppFooter from "../components/common/app-footer"
import SectionLegend from "../components/metrics/section-legend"
import SelectFilter from "../components/metrics/select-filter"
import ProgressionGraph from "../components/metrics/progression-graph"

function ProgressionPage() {
  const { userClimbingLogs, dataDateRange, updateDateRange } = useUserContext()
  const [boulderProgressionFilter, setBoulderProgressionFilter] = useState<
    number
  >(DateFilters.Last6Months)
  const [leadProgressionFilter, setLeadProgressionFilter] = useState<number>(
    DateFilters.Last6Months
  )
  const [trProgressionFilter, setTrProgressionFilter] = useState<number>(
    DateFilters.Last6Months
  )

  useEffect(() => {
    if (!dataDateRange || dataDateRange < DateFilters.Last6Months) {
      updateDateRange(DateFilters.Last6Months)
    }
  }, [])

  return userClimbingLogs === null ? (
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
          <Typography
            color={ThemeColors.darkShade}
            fontFamily={"poppins"}
            gutterBottom
            paddingTop={2}
            variant="h3"
          >
            Progression
          </Typography>

          <Grid container direction={"row"} marginBottom={2}>
            <SectionLegend section="progression" />
          </Grid>

          <Grid
            border={1}
            borderColor={AppColors.primary}
            borderRadius={5}
            container
            direction={"column"}
            padding={2}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"row"}
              display={"grid"}
              gridAutoRows={"auto"}
              gridTemplateColumns={"1fr 1fr 1fr"}
            >
              <Typography
                color={ThemeColors.darkShade}
                fontFamily={"poppins"}
                gridColumn={{ sm: "2", xs: "1" }}
                gutterBottom
                justifySelf={{ sm: "center", xs: "start" }}
                paddingLeft={{ sm: 0, xs: 2 }}
                variant="h5"
              >
                Bouldering
              </Typography>

              <Grid item gridColumn={"3"} gridRow={"1"} justifySelf={"end"}>
                <SelectFilter
                  dashboardSection="progression"
                  selectedFilter={boulderProgressionFilter}
                  setFilter={setBoulderProgressionFilter}
                />
              </Grid>
            </Grid>

            <Grid container item direction={"row"} justifyContent={"center"}>
              <ProgressionGraph
                climbType={GYM_CLIMB_TYPES.Boulder}
                filter={boulderProgressionFilter}
              />
            </Grid>
          </Grid>

          <Grid
            border={1}
            borderColor={AppColors.primary}
            borderRadius={5}
            container
            direction={"column"}
            marginTop={2}
            padding={2}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"row"}
              display={"grid"}
              gridAutoRows={"auto"}
              gridTemplateColumns={"1fr 1fr 1fr"}
            >
              <Typography
                color={ThemeColors.darkShade}
                fontFamily={"poppins"}
                gridColumn={{ sm: "2", xs: "1" }}
                gutterBottom
                justifySelf={{ sm: "center", xs: "start" }}
                paddingLeft={{ sm: 0, xs: 2 }}
                variant="h5"
              >
                Lead
              </Typography>

              <Grid item gridColumn={"3"} justifySelf={"end"}>
                <SelectFilter
                  dashboardSection="progression"
                  selectedFilter={leadProgressionFilter}
                  setFilter={setLeadProgressionFilter}
                />
              </Grid>
            </Grid>

            <Grid container item direction={"row"} justifyContent={"center"}>
              <ProgressionGraph
                climbType={GYM_CLIMB_TYPES.Lead}
                filter={leadProgressionFilter}
              />
            </Grid>
          </Grid>

          <Grid
            border={1}
            borderColor={AppColors.primary}
            borderRadius={5}
            container
            direction={"column"}
            marginTop={2}
            padding={2}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"row"}
              display={"grid"}
              gridAutoRows={"auto"}
              gridTemplateColumns={"1fr 1fr 1fr"}
            >
              <Typography
                color={ThemeColors.darkShade}
                fontFamily={"poppins"}
                gridColumn={{ sm: "2", xs: "1" }}
                gutterBottom
                justifySelf={{ sm: "center", xs: "start" }}
                paddingLeft={{ sm: 0, xs: 2 }}
                variant="h5"
              >
                Top Rope
              </Typography>

              <Grid item gridColumn={"3"} justifySelf={"end"}>
                <SelectFilter
                  dashboardSection="progression"
                  selectedFilter={trProgressionFilter}
                  setFilter={setTrProgressionFilter}
                />
              </Grid>
            </Grid>

            <Grid container item direction={"row"} justifyContent={"center"}>
              <ProgressionGraph
                climbType={GYM_CLIMB_TYPES.TopRope}
                filter={trProgressionFilter}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <AppFooter />
    </>
  )
}

export default ProgressionPage
