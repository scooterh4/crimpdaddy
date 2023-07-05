import React, { useContext } from "react"
import "react-toastify/dist/ReactToastify.css"
import { Button, Grid, Typography } from "@mui/material"
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
      <Grid
        container
        direction="column"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h2"
          component="div"
          gutterBottom
          sx={{ marginTop: "1rem" }}
        >
          Welcome
        </Typography>

        <Button variant="contained" onClick={handleClimbTypeSelectorOpen}>
          Log a climb
        </Button>

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

        <Grid container direction="row" marginLeft={{ xs: -26, sm: 0 }}>
          <GradeGraphWrapper />
        </Grid>
      </Grid>
    </>
  )
}

export default Home
