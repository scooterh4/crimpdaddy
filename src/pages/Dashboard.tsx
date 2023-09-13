import React, { useState } from "react"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
import { Box, Button, FormControl, Grid, Typography } from "@mui/material"
import { useUserContext } from "../components/context-api"
import AppToolbar from "../components/common/AppToolbar"
import AppFooter from "../components/common/AppFooter"
import HardestGradeDisplay from "../components/dashboard/HardestGradeDisplay"
import SectionLegend from "../components/dashboard/SectionLegend"
import ActivityGraph from "../components/dashboard/ActivityGraph"
import SelectFilter from "../components/dashboard/SelectFilter"
import { AppColors, ThemeColors, drawerWidth } from "../static/styles"
import AppLoading from "../components/common/AppLoading"
import { DateFilters } from "../db/ClimbLogService"

const Dashboard = () => {
  const { climbingData } = useUserContext()
  const navigate = useNavigate()
  const handleClimbTypeSelectorOpen = () => navigate("/logClimb")
  const [activityFilter, setActivityFilter] = useState<number>(
    DateFilters.ThisWeek
  )

  return !climbingData ? (
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
                <HardestGradeDisplay
                  climbType="Boulder"
                  tickType="Redpoint"
                  climbingData={climbingData.climbingData}
                />
              </Grid>

              <Grid item xs={4}>
                <HardestGradeDisplay
                  climbType="Lead"
                  tickType="Redpoint"
                  climbingData={climbingData.climbingData}
                />
              </Grid>

              <Grid item xs>
                <HardestGradeDisplay
                  climbType="TopRope"
                  tickType="Redpoint"
                  climbingData={climbingData.climbingData}
                />
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
                  dashboardSection="activity"
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
      <AppFooter />
    </>
  )
}

export default Dashboard
