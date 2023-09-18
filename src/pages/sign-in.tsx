import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import LockIcon from "@mui/icons-material/Lock"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import AppToolbar from "../components/common/app-toolbar"
import { AppColors } from "../styles/styles"
import { useUserContext } from "../context-api"

function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { updateUser } = useUserContext()

  function Submit() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sessionStorage.setItem("Auth Token", userCredential.user.refreshToken)
        updateUser({
          id: userCredential.user.uid,
          email: userCredential.user.email ? userCredential.user.email : "",
        })
        navigate("/dashboard")
      })
      .catch((error) => {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          toast.error("Please check your login credentials")
        } else if (error.code === "auth/invalid-email") {
          toast.error(
            "The email given does not have an account. Please sign up first"
          )
        } else if (error.code === "auth/missing-password") {
          toast.error("You forgot to enter your password silly!")
        } else {
          toast.error("Uh oh! An unexpected error occurred")
          console.log(error.code, error.message)
        }
      })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      Submit()
    }
  }

  return (
    <>
      <AppToolbar title={""} />

      <Container component="main" maxWidth="xs" sx={{ marginTop: 10 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: AppColors.info, color: "white" }}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" fontFamily="poppins" variant="h5">
            Sign in
          </Typography>
          <Box sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onKeyDown={handleKeyDown}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontFamily: "poppins" }}
              onClick={Submit}
            >
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link to={"/"}>Forgot password?</Link>
              </Grid> */}
              <Grid item>
                <Link style={{ fontFamily: "poppins" }} to={"/signup"}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default SignIn
