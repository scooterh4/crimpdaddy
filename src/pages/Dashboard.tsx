import React, { useContext } from "react"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
//import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button, Typography } from "@mui/material"
import { UserContext } from "../Context"

const Home = () => {
  const { user, updateUser } = useContext(UserContext)
  //const navigate = useNavigate()

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault
    console.log("Event")
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

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h1" component="div" gutterBottom>
          {user ? "Hello " + user.firstName : "Hello"}
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
