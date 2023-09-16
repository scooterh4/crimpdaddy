import { Box, Grid, Typography } from "@mui/material"
import React from "react"
import SectionLegend from "../components/dashboard/SectionLegend"
import GradePyramid from "../components/dashboard/GradePyramid"
import { AppColors, ThemeColors, drawerWidth } from "../static/styles"
import { useUserContext } from "../components/context-api"
import AppToolbar from "../components/common/AppToolbar"
import AppLoading from "../components/common/AppLoading"
import AppFooter from "../components/common/AppFooter"
import { GYM_CLIMB_TYPES } from "../static/constants"

function GradePyramidPage() {
  const {
    userClimbingLogs,
    userBoulderGradePyramidData,
    userLeadGradePyramidData,
    userTrGradePyramidData,
  } = useUserContext()

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
          <Typography
            color={ThemeColors.darkShade}
            fontFamily={"poppins"}
            gutterBottom
            paddingTop={2}
            variant="h3"
          >
            Grade Pyramids
          </Typography>

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
                <GradePyramid climbType={GYM_CLIMB_TYPES.Boulder} />
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
                <GradePyramid climbType={GYM_CLIMB_TYPES.Lead} />
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
                <GradePyramid climbType={GYM_CLIMB_TYPES.TopRope} />
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
