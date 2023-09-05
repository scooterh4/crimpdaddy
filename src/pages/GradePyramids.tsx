import { Box, Grid, Typography } from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import SectionLegend from "../components/dashboard/SectionLegend"
import GradePyramid from "../components/dashboard/GradePyramid"
import { AppColors, ThemeColors, drawerWidth } from "../static/styles"
import { ClimbGraphData } from "../static/types"
import { UserContext } from "../db/Context"
import { GetAllUserClimbs } from "../db/ClimbLogService"
import AppToolbar from "../components/common/AppToolbar"
import AppLoading from "../components/common/AppLoading"
import AppFooter from "../components/common/AppFooter"

function GradePyramidPage() {
  const { user, updateUser } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true)
  const [gradePyramidData, setGradePyramidData] = useState({
    boulderData: [] as ClimbGraphData[],
    leadData: [] as ClimbGraphData[],
    trData: [] as ClimbGraphData[],
  })

  useEffect(() => {
    if (user) {
      // on the initial dashboard load, the progression graph needs the last 6 months
      GetAllUserClimbs(user.id, "last6Months").then((data) => {
        setGradePyramidData(data.gradePyramidData)
        setIsLoading(false)
      })
    }
  }, [user])

  return isLoading ? (
    <Box sx={{ display: "flex" }}>
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
        <AppLoading />
      </Box>
    </Box>
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
            {gradePyramidData.boulderData.length > 0 && (
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
                  marginLeft={-5}
                >
                  <GradePyramid
                    climbType="Boulder"
                    graphData={gradePyramidData.boulderData}
                  />
                </Grid>
              </Grid>
            )}

            {gradePyramidData.leadData.length > 0 && (
              <Grid
                alignItems={"center"}
                border={1}
                borderColor={AppColors.primary}
                borderRadius={5}
                container
                direction={"column"}
                gridAutoRows="auto"
                marginBottom={gradePyramidData.trData.length > 0 ? 5 : 0}
                marginTop={gradePyramidData.boulderData.length > 0 ? 5 : 0}
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
                  marginLeft={-5}
                >
                  <GradePyramid
                    climbType="Lead"
                    graphData={gradePyramidData.leadData}
                  />
                </Grid>
              </Grid>
            )}

            {gradePyramidData.trData.length > 0 && (
              <Grid
                alignItems={"center"}
                border={1}
                borderColor={AppColors.primary}
                borderRadius={5}
                container
                direction={"column"}
                gridAutoRows="auto"
                marginTop={
                  gradePyramidData.leadData.length < 1 &&
                  gradePyramidData.boulderData.length > 0
                    ? 5
                    : 0
                }
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
                  marginLeft={-5}
                >
                  <GradePyramid
                    climbType="TopRope"
                    graphData={gradePyramidData.trData}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
      <AppFooter />
    </>
  )
}

export default GradePyramidPage
