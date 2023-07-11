import React, { useContext } from "react"
import "react-toastify/dist/ReactToastify.css"
import { Button, Container, Grid, Typography } from "@mui/material"
import { UserContext } from "../Context"
import Loading from "../components/Loading"
import PickClimbType from "../components/PickClimbTypeDialog"
import ClimbDetailsDialog from "../components/ClimbDetailsDialog"
import Toolbar from "../components/ToolBar"
import GradeGraphWrapper from "../components/GradeGraphWrapper"

const Home = () => {
  const { user, updateUser } = useContext(UserContext)
  const [openClimbTypeSelector, setClimbTypeSelector] = React.useState(false)
  const handleClimbTypeSelectorOpen = () => setClimbTypeSelector(true)
  const handleClimbTypeSelectorClose = () => setClimbTypeSelector(false)

  const [openDetails, setDetailsOpen] = React.useState(false)
  const [climbType, setClimbType] = React.useState(0)
  const handleDetailsOpen = () => setDetailsOpen(true)
  const handleDetailsClose = () => setDetailsOpen(false)

  const isLoading = !user

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
            background: "#B04F54",
          }}
        >
          <Grid
            container
            item
            spacing={2}
            direction="column"
            xs={12}
            sm={3}
            style={{ background: "#B04F54" }}
          >
            {/* <Grid
            container
            direction="column"
            sm={3}
            xs={12}
            spacing={5}
            style={{ background: "#D99697" }}
          > */}
            <GradeGraphWrapper />
            {/* </Grid> */}
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Home
