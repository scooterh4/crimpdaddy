import React, { useState } from "react"
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
import { useNavigate } from "react-router-dom"
import { AppColors, ThemeColors } from "../../static/styles"
import { useAuthContext } from "../context/auth-context"
import { Routes } from "../app/router"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { loginUser, googleLogin } = useAuthContext()

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      loginUser(email, password)
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
            onClick={() => loginUser(email, password)}
          >
            Login
          </Button>
        </Box>
        <Divider flexItem sx={{ fontFamily: "poppins", fontSize: 12 }}>
          OR
        </Divider>
        <Button
          onClick={googleLogin}
          sx={{
            background: "none",
            border: "none",
            fontFamily: "poppins",
            marginTop: 3,
            marginBottom: 2,
            textTransform: "none",
          }}
        >
          <GoogleIcon sx={{ marginRight: 1 }} />
          Login with Google
        </Button>
        <Link
          to={"/resetPassword"}
          style={{
            background: "none",
            border: "none",
            color: "black",
            fontFamily: "poppins",
            fontSize: 12,
          }}
        >
          {"Forgot password?"}
        </Link>
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
