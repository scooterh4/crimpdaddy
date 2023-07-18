import React, { useContext, useEffect, useState } from "react"
import "react-toastify/dist/ReactToastify.css"
import { Button, Container, Grid, Typography } from "@mui/material"
import { UserContext } from "../db/Context"
import Loading from "../components/Loading"
import PickClimbType from "../components/PickClimbTypeDialog"
import ClimbDetailsDialog from "../components/ClimbDetailsDialog"
import Toolbar from "../components/ToolBar"
import GradeGraphWrapper from "../components/GradeGraphWrapper"
import MonthlyClimbsGraph from "../components/MonthlyClimbsGraph"
import { GetClimbsByUser, ClimbingData } from "../db/ClimbLogService"
import { ClimbGraphData, ClimbLog } from "../static/types"
import HardestGradeDisplay from "../components/HardestGradeDisplay"
import { TICK_TYPES } from "../static/constants"
import GradeGraph from "../components/GradeGraph"

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
            justifyContent: "space-between",
          }}
        >
          <Grid item>
            <Typography variant="h3" marginTop={1} component="div" gutterBottom>
              Dashboard
            </Typography>
          </Grid>

          <Grid item />

          <Grid item sx={{ paddingTop: 2 }}>
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
            paddingLeft={2}
            marginBottom={2}
            direction="row"
            style={{ display: "flex", background: dashboardBackground }}
          >
            <MonthlyClimbsGraph climbingData={climbingData} />
          </Grid>

          <Grid
            container
            direction={"row"}
            justifyContent={"center"}
            alignContent={"center"}
            style={{
              display: "flex-inline",
              background: dashboardBackground,
            }}
          >
            <Grid
              container
              item
              lg={4}
              md={6}
              xs={12}
              direction={"column"}
              padding={2}
              style={{
                background: dashboardBackground,
              }}
            >
              <Typography variant="h5">Bouldering</Typography>

              <Grid
                container
                direction={"row"}
                padding={2}
                style={{
                  background: dashboardBackground,
                }}
              >
                <Grid item style={{ background: dashboardBackground }}>
                  <HardestGradeDisplay
                    climbType="Boulder"
                    tickType="Onsight"
                    climbingData={climbingData}
                  />
                </Grid>
                <Grid
                  item
                  paddingLeft={2}
                  style={{ background: dashboardBackground }}
                >
                  <HardestGradeDisplay
                    climbType="Boulder"
                    tickType="Flash"
                    climbingData={climbingData}
                  />
                </Grid>
                <Grid
                  item
                  paddingLeft={2}
                  style={{ background: dashboardBackground }}
                >
                  <HardestGradeDisplay
                    climbType="Boulder"
                    tickType="Redpoint"
                    climbingData={climbingData}
                  />
                </Grid>
              </Grid>

              <GradeGraph
                climbType="Boulder"
                graphData={gradePyramidData.boulderData}
              />
            </Grid>

            <Grid
              container
              item
              lg={4}
              md={6}
              xs={12}
              direction={"column"}
              padding={2}
              style={{
                background: dashboardBackground,
              }}
            >
              <Typography variant="h5">Lead</Typography>
              <Grid
                container
                direction={"row"}
                padding={2}
                style={{
                  background: dashboardBackground,
                }}
              >
                <Grid item style={{ background: dashboardBackground }}>
                  <HardestGradeDisplay
                    climbType="Lead"
                    tickType="Onsight"
                    climbingData={climbingData}
                  />
                </Grid>
                <Grid
                  item
                  paddingLeft={2}
                  style={{ background: dashboardBackground }}
                >
                  <HardestGradeDisplay
                    climbType="Lead"
                    tickType="Flash"
                    climbingData={climbingData}
                  />
                </Grid>
                <Grid
                  item
                  paddingLeft={2}
                  style={{ background: dashboardBackground }}
                >
                  <HardestGradeDisplay
                    climbType="Lead"
                    tickType="Redpoint"
                    climbingData={climbingData}
                  />
                </Grid>
              </Grid>

              <GradeGraph
                climbType="Lead"
                graphData={gradePyramidData.leadData}
              />
            </Grid>

            <Grid
              container
              item
              lg={4}
              md={6}
              xs={12}
              direction={"column"}
              padding={2}
              style={{
                background: dashboardBackground,
              }}
            >
              <Typography variant="h5">Top Rope</Typography>

              <Grid
                container
                direction={"row"}
                padding={2}
                style={{
                  background: dashboardBackground,
                }}
              >
                <Grid item style={{ background: dashboardBackground }}>
                  <HardestGradeDisplay
                    climbType="TopRope"
                    tickType="Onsight"
                    climbingData={climbingData}
                  />
                </Grid>
                <Grid
                  item
                  paddingLeft={2}
                  style={{ background: dashboardBackground }}
                >
                  <HardestGradeDisplay
                    climbType="TopRope"
                    tickType="Flash"
                    climbingData={climbingData}
                  />
                </Grid>
                <Grid
                  item
                  paddingLeft={2}
                  style={{ background: dashboardBackground }}
                >
                  <HardestGradeDisplay
                    climbType="TopRope"
                    tickType="Redpoint"
                    climbingData={climbingData}
                  />
                </Grid>
              </Grid>

              <GradeGraph
                climbType="TopRope"
                graphData={gradePyramidData.trData}
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Home
