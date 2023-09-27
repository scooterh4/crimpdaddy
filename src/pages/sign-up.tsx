import React, { useEffect, useState } from "react"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import AppToolbar from "../components/common/app-toolbar"
import { AppColors } from "../styles/styles"

function SignUp() {
  const isAuthenticated = !!sessionStorage.getItem("Auth Token")
  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [])

  function Submit() {
    if (input.password.length < 6) {
      setError((inputObj) => {
        const stateObj = { ...inputObj, ["password"]: "" }
        stateObj["password"] =
          "Your password must be at least 6 characters long."
        return stateObj
      })
    } else if (
      error.email === "" &&
      error.password === "" &&
      error.confirmPassword === ""
    ) {
      createUserWithEmailAndPassword(auth, input.email, input.password)
        .then((userCredential) => {
          navigate("/login")
          toast.success(
            "Registration successful! Please login with your credentials"
          )
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            setError((inputObj) => {
              const stateObj = { ...inputObj, ["email"]: "" }
              stateObj["email"] = "This email is already in use."
              return stateObj
            })
          } else if (error.code === "auth/invalid-email") {
            setError((inputObj) => {
              const stateObj = { ...inputObj, ["email"]: "" }
              stateObj["email"] = "The email entered is invalid."
              return stateObj
            })
          } else if (error.code === "auth/weak-password") {
            setError((inputObj) => {
              const stateObj = { ...inputObj, ["password"]: "" }
              stateObj["password"] =
                "Your password must be atleast 6 characters long."
              return stateObj
            })
          } else {
            toast.error("Uh oh! An unexpected error occurred")
            console.log(error.code, error.message)
          }
        })
    }
  }

  function onInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setInput((inputObj) => ({
      ...inputObj,
      [name]: value,
    }))
    validateInput(e)
  }

  function validateInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    let { name, value } = e.target
    setError((inputObj) => {
      const stateObj = { ...inputObj, [name]: "" }

      switch (name) {
        case "email":
          if (!value) {
            stateObj[name] = "Please enter email."
          }
          break

        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password."
          } else if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj["confirmPassword"] =
              "Password and Confirm Password does not match."
          } else {
            stateObj["confirmPassword"] = input.confirmPassword
              ? ""
              : error.confirmPassword
          }
          break

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Please enter Confirm Password."
          } else if (input.password && value !== input.password) {
            stateObj[name] = "Password and Confirm Password does not match."
          }
          break

        default:
          break
      }

      return stateObj
    })
  }

  return (
    <>
      <AppToolbar title={""} />

      <Container component="main" maxWidth="xs" sx={{ marginTop: 10 }}>
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: AppColors.success }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" fontFamily={"poppins"} variant="h5">
            Sign up
          </Typography>
          <Box sx={{ mt: 3 }}>
            <TextField
              error={error.email !== ""}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              helperText={error.email}
              onChange={(e) => onInputChange(e)}
              onBlur={(e) => validateInput(e)}
            />
            <TextField
              error={error.password !== ""}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              helperText={error.password}
              onChange={(e) => onInputChange(e)}
              onBlur={(e) => validateInput(e)}
            />
            <TextField
              error={error.confirmPassword !== ""}
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              helperText={error.confirmPassword}
              onChange={(e) => onInputChange(e)}
              onBlur={(e) => validateInput(e)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  Submit()
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontFamily: "poppins" }}
              onClick={Submit}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link style={{ fontFamily: "poppins" }} to={"/login"}>
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default SignUp
