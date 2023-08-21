import React, { useContext, useEffect, useState } from "react"
import "react-toastify/dist/ReactToastify.css"
import {
  Button,
  Card,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { UserContext } from "../db/Context"
import PickClimbType from "../components/dashboard/PickClimbTypeDialog"
import ClimbDetailsDialog from "../components/dashboard/ClimbDetailsDialog"
import Toolbar from "../components/common/ToolBar"
import { GetAllUserClimbs } from "../db/ClimbLogService"
import { ClimbGraphData, ClimbLog } from "../static/types"
import HardestGradeDisplay from "../components/dashboard/HardestGradeDisplay"
import { CLIMB_TYPES } from "../static/constants"
import GradePyramid from "../components/dashboard/GradePyramid"
import GradePyramidsLegend from "../components/dashboard/GradePyramidsLegend"
import Footer from "../components/common/Footer"
import ProgressionGraph from "../components/dashboard/ProgressionGraph"
import VolumeGraph from "../components/dashboard/VolumeGraph"
import ReactLoading from "react-loading"
import SelectFilter from "../components/dashboard/SelectFilter"

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

  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))
  const smScreen = useMediaQuery(theme.breakpoints.only("sm"))
  const redpointCardPadding = xsScreen ? 1 : 2
  const redpointCardColor = "#FF7A6B"

  const dashboardBackground = "#F2EEED"
  const dashboardTitleJustify = xsScreen || smScreen ? "center" : "start"
  const logClimbButtonJustify = xsScreen || smScreen ? "center" : "end"

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
        <ReactLoading type="spin" color="#0000FF" height={200} width={100} />
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

      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          marginBottom={2}
          marginTop={2}
          sx={{
            display: "flex-inline",
          }}
        >
          <Grid item container justifyContent={"center"} alignItems={"center"}>
            <Button
              variant="contained"
              size="large"
              onClick={handleClimbTypeSelectorOpen}
            >
              Log a climb
            </Button>
          </Grid>
        </Grid>

        <Grid
          container
          padding={2}
          style={{
            display: "flex",
            background: dashboardBackground,
          }}
        >
          <Grid
            container
            item
            direction={"row"}
            justifyContent={"center"}
            style={{
              background: dashboardBackground,
            }}
          >
            <Typography
              variant="h4"
              fontFamily={"poppins"}
              component="div"
              gutterBottom
            >
              Redpoint Grades
            </Typography>
          </Grid>

          <Grid container direction={"row"} justifyContent={"center"}>
            <Grid item>
              <Card
                sx={{
                  padding: redpointCardPadding,
                  backgroundColor: redpointCardColor,
                }}
              >
                <HardestGradeDisplay
                  climbType="Boulder"
                  tickType="Redpoint"
                  climbingData={climbingData}
                />
              </Card>
            </Grid>
            <Grid
              item
              paddingLeft={redpointCardPadding}
              paddingRight={redpointCardPadding}
            >
              <Card
                sx={{
                  padding: redpointCardPadding,
                  backgroundColor: redpointCardColor,
                }}
              >
                <HardestGradeDisplay
                  climbType="Lead"
                  tickType="Redpoint"
                  climbingData={climbingData}
                />
              </Card>
            </Grid>
            <Grid item>
              <Card
                sx={{
                  padding: redpointCardPadding,
                  backgroundColor: redpointCardColor,
                }}
              >
                <HardestGradeDisplay
                  climbType="TopRope"
                  tickType="Redpoint"
                  climbingData={climbingData}
                />
              </Card>
            </Grid>
          </Grid>

          <Grid
            container
            direction={"column"}
            marginTop={5}
            marginBottom={1}
            style={{
              background: dashboardBackground,
            }}
          >
            <Grid
              container
              item
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Typography
                variant="h4"
                fontFamily={"poppins"}
                component="div"
                gutterBottom
              >
                Activity
              </Typography>
            </Grid>

            <Grid
              container
              item
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <SelectFilter
                dashboardSection="activity"
                selectedFilter={activityFilter}
                setFilter={setActivityFilter}
              />
            </Grid>

            <Grid
              container
              item
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Card
                sx={{
                  paddingTop: 2,
                  borderRadius: 5,
                  width: "100%",
                }}
              >
                <VolumeGraph
                  propClimbingData={climbingData}
                  filter={activityFilter}
                />
              </Card>
            </Grid>
          </Grid>

          <Grid
            container
            direction={"row"}
            justifyContent={"center"}
            marginTop={5}
            style={{
              background: dashboardBackground,
            }}
          >
            <Grid
              container
              direction={"column"}
              alignItems={"center"}
              style={{
                background: dashboardBackground,
              }}
            >
              <Typography
                variant="h4"
                fontFamily={"poppins"}
                component="div"
                gutterBottom
              >
                Grade Pyramids
              </Typography>
              <GradePyramidsLegend />
            </Grid>
          </Grid>

          <Grid
            container
            direction={"row"}
            justifyContent={"center"}
            marginTop={3}
            marginBottom={5}
            style={{
              background: dashboardBackground,
            }}
          >
            <Grid
              container
              item
              lg={4}
              md={6}
              xs={12}
              alignItems={"center"}
              direction={"column"}
            >
              <Card
                sx={{
                  borderRadius: 5,
                  margin: 2,
                  padding: 2,
                }}
              >
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                  Bouldering
                </Typography>

                <GradePyramid
                  climbType="Boulder"
                  graphData={gradePyramidData.boulderData}
                />
              </Card>
            </Grid>

            <Grid
              container
              item
              lg={4}
              md={6}
              xs={12}
              direction={"column"}
              alignItems={"center"}
              style={{
                background: dashboardBackground,
              }}
            >
              <Card
                sx={{
                  borderRadius: 5,
                  margin: 2,
                  padding: 2,
                }}
              >
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                  Lead
                </Typography>

                <GradePyramid
                  climbType="Lead"
                  graphData={gradePyramidData.leadData}
                />
              </Card>
            </Grid>

            <Grid
              container
              item
              lg={4}
              md={6}
              xs={12}
              marginTop={2}
              direction={"column"}
              alignItems={"center"}
            >
              <Card
                sx={{
                  borderRadius: 5,
                  padding: 2,
                }}
              >
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                  Top Rope
                </Typography>

                <GradePyramid
                  climbType="TopRope"
                  graphData={gradePyramidData.trData}
                />
              </Card>
            </Grid>
          </Grid>

          <Grid
            container
            direction={"column"}
            marginTop={5}
            marginBottom={1}
            style={{
              background: dashboardBackground,
            }}
          >
            <Grid
              container
              item
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Typography
                variant="h4"
                fontFamily={"poppins"}
                component="div"
                gutterBottom
              >
                Progression
              </Typography>
            </Grid>

            <Grid
              container
              direction={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              marginBottom={2}
            >
              <Grid item>
                <SelectFilter
                  dashboardSection="progression"
                  selectedFilter={boulderProgressionFilter}
                  setFilter={setBoulderProgressionFilter}
                />
              </Grid>

              <Card
                sx={{
                  padding: 2,
                  borderRadius: 5,
                  width: "100%",
                }}
              >
                <Grid
                  container
                  direction={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography variant="h5" textAlign={"center"}>
                    Hardest Boulders by Month
                  </Typography>

                  <ProgressionGraph
                    climbType={CLIMB_TYPES.Boulder}
                    climbingData={climbingData}
                    filter={boulderProgressionFilter}
                  />
                </Grid>
              </Card>
            </Grid>

            <Grid
              container
              direction={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              marginBottom={2}
            >
              <Grid item>
                <SelectFilter
                  dashboardSection="progression"
                  selectedFilter={leadProgressionFilter}
                  setFilter={setLeadProgressionFilter}
                />
              </Grid>

              <Card
                sx={{
                  padding: 2,
                  borderRadius: 5,
                  width: "100%",
                }}
              >
                <Grid
                  container
                  direction={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography variant="h5" textAlign={"center"}>
                    Hardest Leads by Month
                  </Typography>

                  <ProgressionGraph
                    climbType={CLIMB_TYPES.Sport}
                    climbingData={climbingData}
                    filter={leadProgressionFilter}
                  />
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  )
}

export default Home
