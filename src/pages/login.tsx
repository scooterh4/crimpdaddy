import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material"
import GoogleIcon from "@mui/icons-material/Google"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, provider } from "../firebase"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { AppColors, ThemeColors } from "../styles/styles"
import { useUserContext } from "../user-context"

export default function SignIn() {
  const isAuthenticated = !!sessionStorage.getItem("Auth Token")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { updateUser } = useUserContext()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [])

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

  function googleSignIn() {
    signInWithPopup(auth, provider).then((userCredential) => {
      sessionStorage.setItem("Auth Token", userCredential.user.refreshToken)
      updateUser({
        id: userCredential.user.uid,
        email: userCredential.user.email ? userCredential.user.email : "",
      })
      navigate("/dashboard")
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      Submit()
    }
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 10 }}>
      <Box
        border={1}
        borderColor={ThemeColors.lightAccent}
        padding={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          sx={{
            fontFamily: "poppins",
            background: "none",
            border: "none",
            textTransform: "none",
            ":hover": { backgroundColor: "transparent" },
          }}
        >
          <Typography
            variant="h4"
            fontFamily={"poppins"}
            marginTop={1}
            component="div"
            gutterBottom
            color={AppColors.primary}
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            CrimpDaddy
          </Typography>
        </Button>
        <Box sx={{ mt: 3 }}>
          <TextField
            margin="dense"
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
            margin="dense"
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
            sx={{
              backgroundColor: ThemeColors.darkAccent,
              ":hover": { backgroundColor: AppColors.info },
              mt: 3,
              mb: 2,
              fontFamily: "poppins",
              textTransform: "none",
            }}
            onClick={Submit}
          >
            Login
          </Button>
        </Box>
        <Divider flexItem sx={{ fontFamily: "poppins", fontSize: 12 }}>
          OR
        </Divider>
        <Button
          onClick={googleSignIn}
          sx={{
            background: "none",
            border: "none",
            fontFamily: "poppins",
            marginTop: 2,
            textTransform: "none",
          }}
        >
          <GoogleIcon sx={{ marginRight: 1 }} />
          Login with Google
        </Button>
      </Box>

      <Box
        border={1}
        borderColor={ThemeColors.lightAccent}
        marginTop={2}
        padding={4}
        textAlign={"center"}
        sx={{
          flexDirection: "column",
          fontFamily: "poppins",
          fontSize: 14,
        }}
      >
        Don't have an account?
        <Link to={"/signup"} style={{ marginLeft: 5 }}>
          {"Sign up"}
        </Link>
      </Box>
    </Container>
  )
}
