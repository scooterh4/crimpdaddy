import React, { useEffect, useState } from "react"
import "react-toastify/dist/ReactToastify.css"
import { useLocation, useNavigate } from "react-router-dom"
import { Box, Button, FormControl, Grid, Typography } from "@mui/material"
import { useUserContext } from "../user-context"
import AppLoading from "../components/common/app-loading"
import AppFooter from "../components/common/app-footer"
import HardestGradeDisplay from "../components/metrics/redpoint-grade-display"
import SelectFilter from "../components/metrics/select-filter"
import ActivityGraph from "../components/metrics/activity-graph"
import SectionLegend from "../components/metrics/section-legend"
import AppToolbar from "../components/common/app-toolbar"
import { DateFilters } from "../constants"
import { AppColors, ThemeColors, drawerWidth } from "../styles/styles"

const Dashboard = () => {
  const { userClimbingLogs } = useUserContext()
  const navigate = useNavigate()
  const handleClimbTypeSelectorOpen = () => navigate("/logClimb")
  const [activityFilter, setActivityFilter] = useState<number>(
    DateFilters.ThisWeek
  )

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
      <AppFooter isAuthenticated={true} />
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
            Dashboard
          </Typography>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <Button
              onClick={handleClimbTypeSelectorOpen}
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
              Log a climb
            </Button>
          </FormControl>

          <Typography
            color={ThemeColors.darkShade}
            fontFamily={"poppins"}
            gutterBottom
            textAlign={"center"}
            variant="h4"
          >
            Redpoint Grades
          </Typography>
          <Grid
            container
            item
            direction={"row"}
            justifyContent={"center"}
            padding={2}
            border={1}
            borderColor={AppColors.primary}
            sx={{ borderRadius: 5 }}
          >
            <Grid container direction={"row"} justifyContent={"center"}>
              <Grid item xs>
                <HardestGradeDisplay climbType="Boulder" />
              </Grid>

              <Grid item xs={4}>
                <HardestGradeDisplay climbType="Lead" />
              </Grid>

              <Grid item xs>
                <HardestGradeDisplay climbType="TopRope" />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            direction={"column"}
            marginTop={6}
            padding={2}
            border={1}
            borderColor={AppColors.primary}
            borderRadius={5}
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
                  page="activity"
                  dateFilter={true}
                  selectedFilter={activityFilter}
                  setFilter={setActivityFilter}
                />
              </Grid>
            </Grid>

            <Grid container item direction={"row"} alignItems={"center"}>
              <ActivityGraph filter={activityFilter} />
            </Grid>

            <SectionLegend section="activity" />
          </Grid>
        </Box>
      </Box>
      <AppFooter isAuthenticated={true} />
    </>
  )
}

export default Dashboard
