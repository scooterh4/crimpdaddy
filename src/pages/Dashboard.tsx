import React, { useContext } from "react"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
//import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button, Typography } from "@mui/material"
import { UserContext } from "../Context"
import Loading from "../components/Loading"
import LogModal from "../components/LogModal"

const Home = () => {
  const { user, updateUser } = useContext(UserContext)
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const isLoading = !user

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("Auth Token")
        updateUser(null)
        toast.success("Goodbye!", { toastId: "logoutSuccess" })
      })
      .catch((error) => {
        console.log(error.code, error.message)
      })
  }

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h1" component="div" gutterBottom>
          {user ? user.email : ""}
        </Typography>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" component="div" gutterBottom>
          Welcome to Crimpdaddy
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
        <Button variant="contained" onClick={handleOpen}>
          Log a climb
        </Button>
        <LogModal open={open} handleClose={handleClose} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </>
  )
}

export default Home
