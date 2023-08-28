import React, { useContext, useEffect, useState } from "react"
import "react-toastify/dist/ReactToastify.css"
import { Button, Container, Grid, Typography } from "@mui/material"
import { UserContext } from "../db/Context"
import PickClimbType from "../components/dashboard/PickClimbTypeDialog"
import ClimbDetailsDialog from "../components/dashboard/ClimbDetailsDialog"
import Toolbar from "../components/common/ToolBar"
import { GetAllUserClimbs } from "../db/ClimbLogService"
import { ClimbGraphData, ClimbLog } from "../static/types"
import HardestGradeDisplay from "../components/dashboard/HardestGradeDisplay"
import { CLIMB_TYPES } from "../static/constants"
import GradePyramid from "../components/dashboard/GradePyramid"
import SectionLegend from "../components/dashboard/SectionLegend"
import Footer from "../components/common/Footer"
import ProgressionGraph from "../components/dashboard/ProgressionGraph"
import ActivityGraph from "../components/dashboard/ActivityGraph"
import ReactLoading from "react-loading"
import SelectFilter from "../components/dashboard/SelectFilter"
import { AppColors, ThemeColors } from "../static/styles"
import BackgroundImage from "../images/neom-xhMz5xIbhRg-unsplash.jpg"

const Home = () => {
  const { user, updateUser } = useContext(UserContext)
  const [climbingData, setClimbingData] = useState<ClimbLog[]>([])
  const [gradePyramidData, setGradePyramidData] = useState({
    boulderData: [] as ClimbGraphData[],
    leadData: [] as ClimbGraphData[],
    trData: [] as ClimbGraphData[],
  })

  const [openClimbTypeSelector, setClimbTypeSelector] = useState(false)
  const handleClimbTypeSelectorOpen = () => setClimbTypeSelector(true)
  const handleClimbTypeSelectorClose = () => setClimbTypeSelector(false)
  const [openDetails, setDetailsOpen] = useState(false)
  const [climbType, setClimbType] = useState(0)
  const handleDetailsOpen = () => setDetailsOpen(true)
  const handleDetailsClose = () => setDetailsOpen(false)
  const [isLoading, setIsLoading] = useState(true)

  const [activityFilter, setActivityFilter] = useState<string>("thisWeek")
  const [boulderProgressionFilter, setBoulderProgressionFilter] = useState<
    string
  >("last6Months")
  const [leadProgressionFilter, setLeadProgressionFilter] = useState<string>(
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

  function handleSubmitClimbType() {
    setClimbTypeSelector(false)
    handleDetailsOpen()
  }

  // Passed to the ClimbDetailsDialog to reload the data after a climb is logged
  function climbLogged() {
    if (user) {
      setIsLoading(true)

      GetAllUserClimbs(user.id, "last6Months").then((data) => {
        setClimbingData(data.climbingData)
        setGradePyramidData(data.gradePyramidData)
        setIsLoading(false)
      })
    }
  }

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
      <Toolbar
        title={"Dashboard"}
        user={{ appUser: user, updateUser: updateUser }}
      />

      <PickClimbType
        open={openClimbTypeSelector}
        handleClose={handleClimbTypeSelectorClose}
        setClimbType={setClimbType}
        handleSubmitClimbType={handleSubmitClimbType}
      />
      <ClimbDetailsDialog
        climbType={climbType}
        open={openDetails}
        handleClose={handleDetailsClose}
        climbLogged={climbLogged}
      />

      {/* <Grid
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          filter: "sepia(0.75)",
          //opacity: 0.5,
        }}
      /> */}
      <Container maxWidth="md">
        <Grid
          container
          direction={"column"}
          style={{
            display: "flex",
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
                climbType={CLIMB_TYPES.Boulder}
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
                climbType={CLIMB_TYPES.Sport}
                climbingData={climbingData}
                filter={leadProgressionFilter}
              />

              <SectionLegend section="progression" />
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  )
}

export default Home
