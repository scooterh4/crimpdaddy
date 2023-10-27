import { Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useUserContext } from "../protected-context"
import {
  DateFilters,
  GYM_CLIMB_TYPES,
  PromiseTrackerArea,
} from "../../../static/constants"
import { ThemeColors } from "../../../static/styles"
import AppLoading from "../../common/loading"
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

  useEffect(() => {
    if (!dataDateRange || dataDateRange < DateFilters.Last6Months) {
      updateDateRange(DateFilters.Last6Months, PromiseTrackerArea.Progression)
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
        </Grid>

        <Grid container item direction={"row"} justifyContent={"center"}>
          <ProgressionGraph
            climbType={GYM_CLIMB_TYPES.TopRope}
            filter={dateFilter}
          />
        </Grid>
      </Grid>
    </>
  )
}
