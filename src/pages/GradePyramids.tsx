import { Box, Grid, Typography } from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import SectionLegend from "../components/dashboard/SectionLegend"
import GradePyramid from "../components/dashboard/GradePyramid"
import { ThemeColors, drawerWidth } from "../static/styles"
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
          <Typography
            color={ThemeColors.darkShade}
            fontFamily={"poppins"}
            gutterBottom
            paddingTop={2}
            variant="h3"
          >
            Grade Pyramids
          </Typography>

          <SectionLegend section="gradePyramids" />

          <Grid
            border={1}
            borderColor={ThemeColors.darkAccent}
            borderRadius={5}
            container
            direction={"row"}
            padding={2}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"column"}
              gridAutoRows="auto"
              item
              md
              xs
            >
              <Typography
                fontFamily={"poppins"}
                gridRow={1}
                variant="h6"
                sx={{ textAlign: "center" }}
              >
                Bouldering
              </Typography>

              <Grid item gridRow={2} marginLeft={-5}>
                <GradePyramid
                  climbType="Boulder"
                  graphData={gradePyramidData.boulderData}
                />
              </Grid>
            </Grid>

            <Grid
              alignItems={"center"}
              container
              direction={"column"}
              gridAutoRows="auto"
              item
              md={4}
              xs={12}
            >
              <Typography
                fontFamily={"poppins"}
                gridRow={1}
                variant="h6"
                sx={{ textAlign: "center" }}
              >
                Lead
              </Typography>

              <Grid item gridRow={2} marginLeft={-5}>
                <GradePyramid
                  climbType="Lead"
                  graphData={gradePyramidData.leadData}
                />
              </Grid>
            </Grid>

            <Grid
              alignItems={"center"}
              container
              direction={"column"}
              gridAutoRows="auto"
              item
              md
              xs
            >
              <Typography
                fontFamily={"poppins"}
                gridRow={1}
                variant="h6"
                sx={{ textAlign: "center" }}
              >
                Top Rope
              </Typography>

              <Grid item gridRow={2} marginLeft={-5}>
                <GradePyramid
                  climbType="TopRope"
                  graphData={gradePyramidData.trData}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <AppFooter drawerWidth={drawerWidth} />
    </>
  )
}

export default GradePyramidPage
