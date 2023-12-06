import React, { useState } from "react"
import { Box, Button, Container, Divider, TextField } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { AppColors, ThemeColors } from "../../../../static/styles"
import { auth } from "../../../../firebase"
import { sendPasswordResetEmail } from "firebase/auth"
import { toast } from "react-toastify"
import LockRoundedIcon from "@mui/icons-material/LockRounded"
import { Routes } from "../../../../router"

export default function PasswordReset() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")

  function Submit() {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Check your inbox to reset your password")
        navigate(Routes.login)
      })
      .catch((error) => {
        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/invalid-email"
        ) {
          toast.error(
            "The email given does not have an account. Please sign up first"
          )
        }
        console.log("Error resetting user password")
        console.log(error.code, error.message)
      })
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
        <LockRoundedIcon
          style={{
            color: AppColors.info,
            fontSize: "40pt",
          }}
        />
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
            Send reset email
          </Button>
        </Box>
        <Divider flexItem sx={{ fontFamily: "poppins", fontSize: 12 }}>
          OR
        </Divider>
        <div style={{ marginTop: 15 }}>
          <Link
            to={"/signup"}
            style={{
              background: "none",
              border: "none",
              color: "black",
              fontFamily: "poppins",
              fontSize: 12,
            }}
          >
            {"Create new account"}
          </Link>
        </div>
      </Box>
      <Button
        fullWidth
        onClick={() => navigate(Routes.login)}
        sx={{
          border: 1,
          borderColor: ThemeColors.lightAccent,
          borderRadius: 0,
          backgroundColor: "#eff2f2",
          color: "black",
          fontFamily: "poppins",
          fontSize: 14,
          textTransform: "none",
          ":hover": { backgroundColor: "#eff2f2", color: "white" },
        }}
      >
        Back to login
      </Button>
    </Container>
  )
}
