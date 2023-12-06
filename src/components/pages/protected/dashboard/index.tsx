import React, { useEffect, useState } from "react"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
import { Button, FormControl, Grid, Typography } from "@mui/material"
import AppLoading from "../../../common/loading"
import HardestGradeDisplay from "./components/redpoint-grade-display"
import SelectFilter from "../common/select-filter"
import ActivityGraph from "./components/activity-graph"
import SectionLegend from "../common/section-legend"
import { DateFilters, PromiseTrackerArea } from "../../../../static/constants"
import { ThemeColors } from "../../../../static/styles"
import { Routes } from "../../../../router"
import { getAllUserClimbingData } from "../../../../utils/db"
import {
  useDataDateRangeContext,
  useDataLastReadContext,
  useDataUpdatedContext,
  useProtectedAPI,
  useUserClimbingDataContext,
} from "../context/protected-context"
import { useAuthContext } from "../../../app/context/auth-context"
import moment from "moment"

export default function Dashboard() {
  const { user } = useAuthContext()
  const {
    onUpdateUserClimbingData,
    onUpdateDataLastRead,
    onUpdateDataDateRange,
  } = useProtectedAPI()
  const climbingData = useUserClimbingDataContext()
  const dataDateRange = useDataDateRangeContext()
  const dataLastRead = useDataLastReadContext()
  const dataLastUpdated = useDataUpdatedContext()
  const navigate = useNavigate()
  const [activityFilter, setActivityFilter] = useState<string>(
    DateFilters.ThisWeek
  )

  useEffect(() => {
    if (user) {
      // initial log in
      if (
        !dataDateRange ||
        Object.keys(DateFilters).indexOf(activityFilter) >
          Object.keys(DateFilters).indexOf(dataDateRange)
      ) {
        getAllUserClimbingData(user.id, activityFilter).then((res) => {
          onUpdateUserClimbingData(res)
          onUpdateDataDateRange(activityFilter)
          onUpdateDataLastRead(moment().unix())
        })
      }
      // data was logged, so need fresh data
      else if (dataLastUpdated && dataLastUpdated > dataLastRead) {
        getAllUserClimbingData(user.id, activityFilter).then((res) => {
          onUpdateUserClimbingData(res)
          onUpdateDataDateRange(activityFilter)
          onUpdateDataLastRead(moment().unix())
        })
      }
    }
  }, [user, dataLastUpdated])

  return !user || !climbingData ? (
    <AppLoading />
  ) : (
    <>
      <Typography
        color={ThemeColors.darkShade}
        fontFamily={"poppins"}
        gutterBottom
        paddingTop={2}
        variant="h3"
      >
        Dashboard
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <Button
          onClick={() => navigate(Routes.climbSession)}
          size="large"
          variant="contained"
          sx={{
            background: ThemeColors.darkAccent,
            fontFamily: "poppins",
            ":hover": { backgroundColor: ThemeColors.darkShade },
            textTransform: "none",
            fontSize: "14pt",
          }}
        >
          Start a session
        </Button>
      </FormControl>

      {climbingData.indoorRedpointGrades && (
        <Grid
          container
          direction={"row"}
          justifyContent={"center"}
          justifySelf={{ md: "center" }}
          padding={2}
          border={1}
          borderColor={ThemeColors.darkShade}
          sx={{ backgroundColor: "white", borderRadius: 2 }}
        >
          <Typography
            color={ThemeColors.darkShade}
            fontFamily={"poppins"}
            gutterBottom
            textAlign={"center"}
            variant="h5"
          >
            Hardest Grades
          </Typography>
          <Grid container direction={"row"} justifyContent={"center"}>
            <Grid item xs>
              <HardestGradeDisplay
                data={
                  climbingData.indoorRedpointGrades.boulder
                    ? climbingData.indoorRedpointGrades.boulder
                    : "--"
                }
                climbType="Boulder"
              />
            </Grid>
            <Grid item md={2} xs={4}>
              <HardestGradeDisplay
                data={
                  climbingData.indoorRedpointGrades.lead
                    ? climbingData.indoorRedpointGrades.lead
                    : "--"
                }
                climbType="Lead"
              />
            </Grid>
            <Grid item xs>
              <HardestGradeDisplay
                data={
                  climbingData.indoorRedpointGrades.topRope
                    ? climbingData.indoorRedpointGrades.topRope
                    : "--"
                }
                climbType="TopRope"
              />
            </Grid>
          </Grid>
        </Grid>
      )}

      <Grid
        container
        direction={"column"}
        marginTop={2}
        padding={2}
        border={1}
        borderColor={ThemeColors.darkShade}
        borderRadius={2}
        sx={{ backgroundColor: "white" }}
      >
        <Grid
          alignItems={"center"}
          container
          direction={"row"}
          display={"grid"}
          gridTemplateColumns={"1fr 1fr 1fr"}
          gridAutoRows={"auto"}
        >
          <Typography
            color={ThemeColors.darkShade}
            fontFamily={"poppins"}
            gutterBottom
            gridColumn={{ sm: "2", xs: "1" }}
            justifySelf={{ sm: "center", xs: "start" }}
            paddingLeft={{ sm: 0, xs: 2 }}
            variant="h5"
          >
            Activity
          </Typography>

          <Grid item gridColumn={"3"} gridRow={"1"} justifySelf={"end"}>
            <SelectFilter
              graph={PromiseTrackerArea.Activity}
              dateFilter={true}
              setFilter={setActivityFilter}
            />
          </Grid>
        </Grid>

        <Grid container item direction={"row"} alignItems={"center"}>
          <ActivityGraph
            data={climbingData.allClimbs}
            filter={activityFilter}
          />
        </Grid>

        <SectionLegend section="activity" />
      </Grid>
    </>
  )
}
