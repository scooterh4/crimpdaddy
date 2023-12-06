import React, { useState } from "react"
import { auth } from "../../../../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material"
import GoogleIcon from "@mui/icons-material/Google"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { AppColors, AppFont, ThemeColors } from "../../../../static/styles"
import { useAuthContext } from "../../../app/context/auth-context"
import { Routes } from "../../../../router"

export default function SignUp() {
  const { googleLogin } = useAuthContext()
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
        .then(() => {
          navigate(Routes.login)
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
            fontFamily: AppFont,
            background: "none",
            border: "none",
            textTransform: "none",
            ":hover": { backgroundColor: "transparent" },
          }}
        >
          <Typography
            variant="h4"
            fontFamily={AppFont}
            marginTop={1}
            component="div"
            gutterBottom
            color={AppColors.primary}
            onClick={() => navigate(Routes.landing)}
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
            error={error.email !== ""}
            margin="dense"
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
            margin="dense"
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
            margin="dense"
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
            sx={{
              backgroundColor: ThemeColors.darkAccent,
              ":hover": { backgroundColor: AppColors.info },
              mt: 3,
              mb: 2,
              fontFamily: AppFont,
              textTransform: "none",
            }}
            onClick={Submit}
          >
            Sign up
          </Button>
        </Box>
        <Divider flexItem sx={{ fontFamily: AppFont, fontSize: 12 }}>
          OR
        </Divider>
        <Button
          onClick={googleLogin}
          sx={{
            background: "none",
            border: "none",
            fontFamily: AppFont,
            marginTop: 2,
            textTransform: "none",
          }}
        >
          <GoogleIcon sx={{ marginRight: 1 }} />
          Sign up with Google
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
          fontFamily: AppFont,
          fontSize: 14,
        }}
      >
        Already have an account?
        <Link to={"/login"} style={{ marginLeft: 5 }}>
          {"Login"}
        </Link>
      </Box>
    </Container>
  )
}
