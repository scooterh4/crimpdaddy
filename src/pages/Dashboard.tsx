import React, { useState } from "react"
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button, Typography } from "@mui/material"
import { usersById } from "../db/user_service"
import { CdUser } from "../models/types"

const Home = () => {
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string>("")
  const [userData, setUserData] = useState<CdUser | null>(null)

  if (!userId && auth.currentUser) {
    setUserId(auth.currentUser.uid)
  }

  if (userId && userData === null) {
    usersById(userId).then((data) => {
      console.log("UsersById data: ", data)
      setUserData(data)
    })
  }

  console.log("userData", userData)

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("Auth Token")

        toast.success("Goodbye!", { toastId: "logoutSuccess" })

        navigate("/")
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
          {userData ? "Hello " + userData.firstName : "Hello"}
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
