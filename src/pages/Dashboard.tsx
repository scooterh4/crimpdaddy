import React, { useContext, useEffect, useState } from "react"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Drawer,
  Grid,
  Typography,
} from "@mui/material"
import { UserContext } from "../db/Context"
import AppToolbar from "../components/common/AppToolbar"
import AppFooter from "../components/common/AppFooter"
import { GetAllUserClimbs } from "../db/ClimbLogService"
import { ClimbGraphData, ClimbLog } from "../static/types"
import HardestGradeDisplay from "../components/dashboard/HardestGradeDisplay"
import { GYM_CLIMB_TYPES } from "../static/constants"
import GradePyramid from "../components/dashboard/GradePyramid"
import SectionLegend from "../components/dashboard/SectionLegend"
import ProgressionGraph from "../components/dashboard/ProgressionGraph"
import ActivityGraph from "../components/dashboard/ActivityGraph"
import ReactLoading from "react-loading"
import SelectFilter from "../components/dashboard/SelectFilter"
import { AppColors, ThemeColors } from "../static/styles"
import AppDrawer from "../components/common/AppDrawer"
import BackgroundImage from "../images/neom-xhMz5xIbhRg-unsplash.jpg"

const Home = () => {
  const { user, updateUser } = useContext(UserContext)
  const [climbingData, setClimbingData] = useState<ClimbLog[]>([])
  const [gradePyramidData, setGradePyramidData] = useState({
    boulderData: [] as ClimbGraphData[],
    leadData: [] as ClimbGraphData[],
    trData: [] as ClimbGraphData[],
  })

  const navigate = useNavigate()
  const handleClimbTypeSelectorOpen = () => navigate("/logClimb")
  const [isLoading, setIsLoading] = useState(true)

  const [activityFilter, setActivityFilter] = useState<string>("thisWeek")
  const [boulderProgressionFilter, setBoulderProgressionFilter] = useState<
    string
  >("last6Months")
  const [leadProgressionFilter, setLeadProgressionFilter] = useState<string>(
    "last6Months"
  )
  const [trProgressionFilter, setTrProgressionFilter] = useState<string>(
    "last6Months"
  )

  //const redpointCardColor = "#FF7A6B"

  useEffect(() => {
    if (user) {
      // on the initial dashboard load, the progression graph needs the last 6 months
      GetAllUserClimbs(user.id, "last6Months").then((data) => {
        setClimbingData(data.climbingData)
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
      <AppToolbar
        title={"Dashboard"}
        user={{ appUser: user, updateUser: updateUser }}
      />

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
          <Typography
            color={ThemeColors.darkShade}
            fontFamily={"poppins"}
            gutterBottom
            paddingTop={2}
            variant="h3"
          >
            Dashboard
          </Typography>
          <Button
            onClick={handleClimbTypeSelectorOpen}
            size="large"
            variant="contained"
            sx={{
              background: AppColors.primary,
              display: "flex",
              fontFamily: "poppins",
              justifySelf: "center",
              ":hover": { backgroundColor: ThemeColors.darkAccent },
              marginTop: 2,
            }}
          >
            Log a climb
          </Button>

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
                variant="h6"
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
              <ActivityGraph
                propClimbingData={climbingData}
                filter={activityFilter}
              />
            </Grid>

            <SectionLegend section="activity" />
          </Grid>

          <Typography
            color={ThemeColors.darkShade}
            fontFamily={"poppins"}
            gutterBottom
            marginTop={6}
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
                  climbingData={climbingData}
                />
              </Grid>

              <Grid item xs={4}>
                <HardestGradeDisplay
                  climbType="Lead"
                  tickType="Redpoint"
                  climbingData={climbingData}
                />
              </Grid>

              <Grid item xs>
                <HardestGradeDisplay
                  climbType="TopRope"
                  tickType="Redpoint"
                  climbingData={climbingData}
                />
              </Grid>
            </Grid>
          </Grid>

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

          <Typography
            component="div"
            fontFamily={"poppins"}
            gutterBottom
            marginTop={6}
            textAlign={"center"}
            variant="h4"
          >
            Progression
          </Typography>
          <Grid
            border={1}
            borderColor={ThemeColors.darkAccent}
            borderRadius={5}
            container
            direction={"column"}
            padding={2}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"row"}
              display={"grid"}
              gridAutoRows={"auto"}
              gridTemplateColumns={"1fr 1fr 1fr"}
            >
              <Typography
                color={ThemeColors.darkShade}
                fontFamily={"poppins"}
                gridColumn={{ sm: "2", xs: "1" }}
                gutterBottom
                justifySelf={{ sm: "center", xs: "start" }}
                paddingLeft={{ sm: 0, xs: 2 }}
                variant="h6"
              >
                Bouldering
              </Typography>

              <Grid item gridColumn={"3"} gridRow={"1"} justifySelf={"end"}>
                <SelectFilter
                  dashboardSection="progression"
                  selectedFilter={boulderProgressionFilter}
                  setFilter={setBoulderProgressionFilter}
                />
              </Grid>
            </Grid>

            <Grid container item direction={"row"} alignItems={"center"}>
              <ProgressionGraph
                climbType={GYM_CLIMB_TYPES.Boulder}
                climbingData={climbingData}
                filter={boulderProgressionFilter}
              />
            </Grid>

            <SectionLegend section="progression" />
          </Grid>

          <Grid
            border={1}
            borderColor={ThemeColors.darkAccent}
            borderRadius={5}
            container
            direction={"column"}
            marginTop={2}
            padding={2}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"row"}
              display={"grid"}
              gridAutoRows={"auto"}
              gridTemplateColumns={"1fr 1fr 1fr"}
            >
              <Typography
                color={ThemeColors.darkShade}
                fontFamily={"poppins"}
                gridColumn={{ sm: "2", xs: "1" }}
                gutterBottom
                justifySelf={{ sm: "center", xs: "start" }}
                paddingLeft={{ sm: 0, xs: 2 }}
                variant="h6"
              >
                Lead
              </Typography>

              <Grid item gridColumn={"3"} justifySelf={"end"}>
                <SelectFilter
                  dashboardSection="progression"
                  selectedFilter={leadProgressionFilter}
                  setFilter={setLeadProgressionFilter}
                />
              </Grid>
            </Grid>

            <Grid container item direction={"row"} alignItems={"center"}>
              <ProgressionGraph
                climbType={GYM_CLIMB_TYPES.Lead}
                climbingData={climbingData}
                filter={leadProgressionFilter}
              />

              <SectionLegend section="progression" />
            </Grid>
          </Grid>

          <Grid
            border={1}
            borderColor={ThemeColors.darkAccent}
            borderRadius={5}
            container
            direction={"column"}
            marginTop={2}
            padding={2}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"row"}
              display={"grid"}
              gridAutoRows={"auto"}
              gridTemplateColumns={"1fr 1fr 1fr"}
            >
              <Typography
                color={ThemeColors.darkShade}
                fontFamily={"poppins"}
                gridColumn={{ sm: "2", xs: "1" }}
                gutterBottom
                justifySelf={{ sm: "center", xs: "start" }}
                paddingLeft={{ sm: 0, xs: 2 }}
                variant="h6"
              >
                Top Rope
              </Typography>

              <Grid item gridColumn={"3"} justifySelf={"end"}>
                <SelectFilter
                  dashboardSection="progression"
                  selectedFilter={trProgressionFilter}
                  setFilter={setTrProgressionFilter}
                />
              </Grid>
            </Grid>

            <Grid container item direction={"row"} alignItems={"center"}>
              <ProgressionGraph
                climbType={GYM_CLIMB_TYPES.TopRope}
                climbingData={climbingData}
                filter={trProgressionFilter}
              />

              <SectionLegend section="progression" />
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <AppFooter />
    </>
  )
}

export default Home
