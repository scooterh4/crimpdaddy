import { Box, Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useUserContext } from "../context/user-context"
import {
  DateFilters,
  GYM_CLIMB_TYPES,
  PromiseTrackerArea,
} from "../../static/constants"
import AppToolbar from "../common/toolbar"
import { ThemeColors, drawerWidth } from "../../static/styles"
import AppLoading from "../common/loading"
import AppFooter from "../common/footer"
import SelectFilter from "../common/select-filter"
import ProgressionGraph from "./progression-graph"
import { usePromiseTracker } from "react-promise-tracker"
import SectionLegend from "../common/section-legend"

export default function ProgressionPage() {
  const { dataDateRange, updateDateRange } = useUserContext()
  const { promiseInProgress } = usePromiseTracker({
    area: PromiseTrackerArea.Progression,
  })
  const [dateFilter, setDateFilter] = useState<number>(DateFilters.Last6Months)
  // const [boulderProgressionFilter, setBoulderProgressionFilter] = useState<
  //   number
  // >(DateFilters.Last6Months)
  // const [leadProgressionFilter, setLeadProgressionFilter] = useState<number>(
  //   DateFilters.Last6Months
  // )
  // const [trProgressionFilter, setTrProgressionFilter] = useState<number>(
  //   DateFilters.Last6Months
  // )

  useEffect(() => {
    if (!dataDateRange || dataDateRange < DateFilters.Last6Months) {
      updateDateRange(DateFilters.Last6Months, PromiseTrackerArea.Progression)
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
                Progression
              </Typography>
            </Grid>

            <Grid container item direction={"row"} justifyContent={"center"}>
              <SelectFilter
                graph={PromiseTrackerArea.ProgressionGraph}
                dateFilter={true}
                setFilter={setDateFilter}
              />
            </Grid>

            <Grid container direction={"row"} marginTop={2}>
              <SectionLegend section="activity" />
            </Grid>
          </Grid>

          <Grid
            border={1}
            borderColor={ThemeColors.darkShade}
            borderRadius={2}
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

              {/* <Grid
                item
                gridColumn={{ sm: "3", xs: "2" }}
                gridRow={{ sm: "1", xs: "2" }}
                justifySelf={{ sm: "end", xs: "center" }}
              >
                <SelectFilter
                  graph={PromiseTrackerArea.BoulderProgression}
                  dateFilter={true}
                  setFilter={setBoulderProgressionFilter}
                />
              </Grid> */}
            </Grid>

            <Grid container item direction={"row"} justifyContent={"center"}>
              <ProgressionGraph
                climbType={GYM_CLIMB_TYPES.Boulder}
                filter={dateFilter}
              />
            </Grid>
          </Grid>

          <Grid
            border={1}
            borderColor={ThemeColors.darkShade}
            borderRadius={2}
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

              {/* <Grid
                item
                gridColumn={{ sm: "3", xs: "2" }}
                gridRow={{ sm: "1", xs: 2 }}
                justifySelf={{ sm: "end", xs: "center" }}
              >
                <SelectFilter
                  graph={PromiseTrackerArea.LeadProgression}
                  dateFilter={true}
                  setFilter={setLeadProgressionFilter}
                />
              </Grid> */}
            </Grid>

            <Grid container item direction={"row"} justifyContent={"center"}>
              <ProgressionGraph
                climbType={GYM_CLIMB_TYPES.Lead}
                filter={dateFilter}
              />
            </Grid>
          </Grid>

          <Grid
            border={1}
            borderColor={ThemeColors.darkShade}
            borderRadius={2}
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

              {/* <Grid
                item
                gridColumn={{ sm: "3", xs: "2" }}
                gridRow={{ sm: "1", xs: 2 }}
                justifySelf={{ sm: "end", xs: "center" }}
              >
                <SelectFilter
                  graph={PromiseTrackerArea.TopRopeProgression}
                  dateFilter={true}
                  setFilter={setTrProgressionFilter}
                />
              </Grid> */}
            </Grid>

            <Grid container item direction={"row"} justifyContent={"center"}>
              <ProgressionGraph
                climbType={GYM_CLIMB_TYPES.TopRope}
                filter={dateFilter}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <AppFooter isAuthenticated={true} />
    </>
  )
}
