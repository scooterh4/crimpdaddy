import { Container, CssBaseline, Drawer, Grid, Typography } from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import SectionLegend from "../components/dashboard/SectionLegend"
import GradePyramid from "../components/dashboard/GradePyramid"
import { ThemeColors } from "../static/styles"
import { ClimbGraphData } from "../static/types"
import { UserContext } from "../db/Context"
import { GetAllUserClimbs } from "../db/ClimbLogService"
import ReactLoading from "react-loading"
import AppToolbar from "../components/common/AppToolbar"
import AppDrawer from "../components/common/AppDrawer"

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

  const drawerWidth = 250

  return isLoading ? (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      direction="row"
      sx={{ height: "100vh" }}
    >
      <Grid item>
        <ReactLoading
          type="spin"
          color={ThemeColors.darkAccent}
          height={200}
          width={100}
        />
      </Grid>
    </Grid>
  ) : (
    <>
      <CssBaseline />
      <AppToolbar title={"Dashboard"} />

      <Container sx={{ display: "flex" }}>
        <Grid
          aria-label="mailbox folders"
          container
          direction={"column"}
          sx={{ width: { lg: drawerWidth, xs: 0 } }}
        >
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", lg: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            <AppDrawer />
          </Drawer>
        </Grid>

        <Grid
          container
          direction={"column"}
          marginLeft={{ xl: -15 }}
          sx={{
            width: { lg: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
          }}
        >
          <Grid
            container
            direction={"row"}
            justifyContent={"center"}
            marginBottom={2}
            marginTop={6}
          >
            <Grid container direction={"column"} alignItems={"center"}>
              <Typography
                variant="h4"
                fontFamily={"poppins"}
                component="div"
                gutterBottom
              >
                Grade Pyramids
              </Typography>

              <SectionLegend section="gradePyramids" />
            </Grid>
          </Grid>

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
        </Grid>
      </Container>
    </>
  )
}

export default GradePyramidPage
