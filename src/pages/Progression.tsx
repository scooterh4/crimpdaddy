import { Box, Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useUserContext } from "../user-context"
import { DateFilters, GYM_CLIMB_TYPES, PromiseTrackerArea } from "../constants"
import AppToolbar from "../components/common/app-toolbar"
import { AppColors, ThemeColors, drawerWidth } from "../styles/styles"
import AppLoading from "../components/common/app-loading"
import AppFooter from "../components/common/app-footer"
import SelectFilter from "../components/metrics/select-filter"
import ProgressionGraph from "../components/metrics/progression-graph"
import { usePromiseTracker } from "react-promise-tracker"

function ProgressionPage() {
  const { dataDateRange, updateDateRange } = useUserContext()
  const { promiseInProgress } = usePromiseTracker({
    area: PromiseTrackerArea.Progression,
  })
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
      updateDateRange(DateFilters.Last6Months, "progression")
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
        sx={{ backgroundColor: ThemeColors.backgroundColor, display: "flex" }}
      >
        <AppToolbar title="Dashboard" />

        <Box
          component="main"
          marginTop={5}
          marginBottom={2}
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
            marginBottom={5}
            paddingTop={2}
            variant="h3"
          >
            Progression
          </Typography>

          <Grid
            border={1}
            borderColor={ThemeColors.darkShade}
            borderRadius={5}
            container
            direction={"column"}
            padding={2}
            sx={{ backgroundColor: "white" }}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"row"}
              display={"grid"}
              gridAutoRows={"auto"}
              gridTemplateColumns={"1fr 1fr 1fr"}
              paddingLeft={{ sm: 0, xs: 2 }}
            >
              <Typography
                color={ThemeColors.darkShade}
                fontFamily={"poppins"}
                gridColumn={"2"}
                gridRow={"1"}
                gutterBottom
                justifySelf={"center"}
                variant="h5"
              >
                Bouldering
              </Typography>

              <Grid
                item
                gridColumn={{ sm: "3", xs: "2" }}
                gridRow={{ sm: "1", xs: "2" }}
                justifySelf={{ sm: "end", xs: "center" }}
              >
                <SelectFilter
                  graph={PromiseTrackerArea.BoulderProgression}
                  dateFilter={true}
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
            borderColor={ThemeColors.darkShade}
            borderRadius={5}
            container
            direction={"column"}
            marginTop={5}
            padding={2}
            sx={{ backgroundColor: "white" }}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"row"}
              display={"grid"}
              gridAutoRows={"auto"}
              gridTemplateColumns={"1fr 1fr 1fr"}
              paddingLeft={{ sm: 0, xs: 2 }}
            >
              <Typography
                color={ThemeColors.darkShade}
                fontFamily={"poppins"}
                gridColumn={"2"}
                gridRow={"1"}
                gutterBottom
                justifySelf={"center"}
                variant="h5"
              >
                Lead
              </Typography>

              <Grid
                item
                gridColumn={{ sm: "3", xs: "2" }}
                gridRow={{ sm: "1", xs: 2 }}
                justifySelf={{ sm: "end", xs: "center" }}
              >
                <SelectFilter
                  graph={PromiseTrackerArea.LeadProgression}
                  dateFilter={true}
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
            borderColor={ThemeColors.darkShade}
            borderRadius={5}
            container
            direction={"column"}
            marginTop={5}
            padding={2}
            sx={{ backgroundColor: "white" }}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"row"}
              display={"grid"}
              gridAutoRows={"auto"}
              gridTemplateColumns={"1fr 1fr 1fr"}
              paddingLeft={{ sm: 0, xs: 2 }}
            >
              <Typography
                color={ThemeColors.darkShade}
                fontFamily={"poppins"}
                gridColumn={"2"}
                gridRow={"1"}
                gutterBottom
                justifySelf={"center"}
                variant="h5"
              >
                Top Rope
              </Typography>

              <Grid
                item
                gridColumn={{ sm: "3", xs: "2" }}
                gridRow={{ sm: "1", xs: 2 }}
                justifySelf={{ sm: "end", xs: "center" }}
              >
                <SelectFilter
                  graph={PromiseTrackerArea.TopRopeProgression}
                  dateFilter={true}
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
      <AppFooter isAuthenticated={true} />
    </>
  )
}

export default ProgressionPage
