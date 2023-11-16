import { Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useUserContext } from "../protected-context"
import { DateFilters, PromiseTrackerArea } from "../../../static/constants"
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
  const [dateFilter, setDateFilter] = useState<string>(DateFilters.Last6Months)
  const { userBoulderLogs, userLeadLogs, userTopRopeLogs } = useUserContext()

  // setup titles for displaying data
  const titles: string[] = []
  if (userBoulderLogs && userBoulderLogs.length > 0) titles.push("Bouldering")
  if (userLeadLogs && userLeadLogs.length > 0) titles.push("Lead")
  if (userTopRopeLogs && userTopRopeLogs.length > 0) titles.push("Top Rope")

  useEffect(() => {
    if (
      !dataDateRange ||
      Object.keys(DateFilters).indexOf(dataDateRange) <
        Object.keys(DateFilters).indexOf(DateFilters.Last6Months)
    ) {
      updateDateRange(DateFilters.Last6Months, PromiseTrackerArea.Progression)
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
            paddingLeft={0}
            paddingTop={2}
            variant="h3"
            sx={{ columnSpan: "2" }}
          >
            Progression
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
                graph={PromiseTrackerArea.ProgressionGraph}
                dateFilter={true}
                setFilter={setDateFilter}
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
                padding={2}
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

                <ProgressionGraph climbType={index} filter={dateFilter} />

                <SectionLegend section="progression" />
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </>
  )
}
