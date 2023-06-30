import React, { useContext } from "react"
import "react-toastify/dist/ReactToastify.css"
import { Button, Typography } from "@mui/material"
import { UserContext } from "../Context"
import Loading from "../components/Loading"
import PickClimbType from "../components/PickClimbTypeDialog"
import ClimbDetailsDialog from "../components/ClimbDetailsDialog"
import Toolbar from "../components/ToolBar"

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h1"
          component="div"
          gutterBottom
          sx={{ textAlign: "center", marginTop: "1rem" }}
        >
          Welcome
        </Typography>
      </div>

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
      </div>
    </>
  )
}

export default Home
