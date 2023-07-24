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
import Loading from "../components/Loading"
import PickClimbType from "../components/PickClimbTypeDialog"
import ClimbDetailsDialog from "../components/ClimbDetailsDialog"
import Toolbar from "../components/ToolBar"
import { GetClimbsByUser } from "../db/ClimbLogService"
import { ClimbGraphData, ClimbLog } from "../static/types"
import HardestGradeDisplay from "../components/HardestGradeDisplay"
import { CLIMB_TYPES } from "../static/constants"
import GradeHistogram from "../components/GradeHistogram"
import GradePyramidsLegend from "../components/GradePyramidsLegend"
import Footer from "../components/Footer"
import ProgressionGraph from "../components/ProgressionGraph"
import VolumeGraph from "../components/VolumeGraph"

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
  const isLoading = !user

  const dashboardBackground = "#F2EEED"

  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))
  const redpointCardPadding = xsScreen ? 1 : 2
  const redpointCardColor = "#C48888"

  useEffect(() => {
    if (user) {
      GetClimbsByUser(user.id).then((data) => {
        setClimbingData(data.climbingData)
        setGradePyramidData(data.gradePyramidData)
      })
    }
  }, [user])

  function handleSubmitClimbType() {
    setClimbTypeSelector(false)
    handleDetailsOpen()
  }

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <Toolbar user={user} updateUser={updateUser} />

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
      />

      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          sx={{
            display: "flex-inline",
          }}
        >
          <Grid container item direction={"column"} sm={4} xs={12}>
            <Typography variant="h3" marginTop={1} component="div" gutterBottom>
              Dashboard
            </Typography>
          </Grid>

          <Grid item />

          <Grid
            container
            item
            direction={"column"}
            sm={4}
            xs={12}
            marginBottom={1}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Button
              variant="contained"
              size="medium"
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
            <Typography variant="h4" component="div" gutterBottom>
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
            direction={"row"}
            justifyContent={"center"}
            marginTop={5}
            marginBottom={1}
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
              <Typography variant="h4" component="div" gutterBottom>
                Activity
              </Typography>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            spacing={2}
            justifyContent={"center"}
            style={{ display: "flex", background: dashboardBackground }}
          >
            <Grid item>
              <VolumeGraph climbingData={climbingData} />
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
              <Typography variant="h4" component="div" gutterBottom>
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

                <GradeHistogram
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

                <GradeHistogram
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

                <GradeHistogram
                  climbType="TopRope"
                  graphData={gradePyramidData.trData}
                />
              </Card>
            </Grid>
          </Grid>

          <Grid
            container
            direction={"row"}
            justifyContent={"center"}
            marginBottom={2}
            style={{
              background: dashboardBackground,
            }}
          >
            <Typography variant="h4" component="div" gutterBottom>
              Progression
            </Typography>
          </Grid>

          <Grid
            container
            marginBottom={2}
            direction="row"
            spacing={2}
            justifyContent={"center"}
            style={{ display: "flex", background: dashboardBackground }}
          >
            <Grid item>
              <Card
                sx={{
                  padding: 2,
                  borderRadius: 5,
                  height: "100%",
                }}
              >
                <Grid
                  container
                  direction={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Grid item>
                    <Typography variant="h5" textAlign={"center"}>
                      Hardest Boulders by Month
                    </Typography>
                  </Grid>
                  <Grid item marginLeft={-5}>
                    <ProgressionGraph
                      climbType={CLIMB_TYPES.Boulder}
                      climbingData={climbingData}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid item>
              <Card
                sx={{
                  padding: 2,
                  borderRadius: 5,
                  height: "100%",
                }}
              >
                <Typography variant="h5" textAlign="center">
                  Hardest Leads by Month
                </Typography>
                <ProgressionGraph
                  climbType={CLIMB_TYPES.Sport}
                  climbingData={climbingData}
                />
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
