import { Grid, Typography } from "@mui/material"
import React, { useMemo, useState } from "react"
import SectionLegend from "../common/section-legend"
import GradePyramid from "./grade-pyramid-graph"
import { ThemeColors } from "../../../static/styles"
import { useUserContext } from "../protected-context"
import AppLoading from "../../common/loading"
import {
  DateFilters,
  GYM_CLIMB_TYPES,
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
  const [dateFilter, setDateFilter] = useState<number>(DateFilters.Last6Months)
  const [gradePyramidFilter, setGradePyramidFilter] = useState<number>(
    GradePyramidFilter.ClimbsOnly
  )

  useMemo(() => {
    if (!dataDateRange || dataDateRange < DateFilters.Last6Months) {
      updateDateRange(DateFilters.Last6Months, PromiseTrackerArea.GradePyramids)
    }
  }, [])

  return promiseInProgress ? (
    <AppLoading />
  ) : (
    <>
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
    </>
  )
}
