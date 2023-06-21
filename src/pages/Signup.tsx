import React, { useState } from "react"
import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { collection, doc, setDoc } from "firebase/firestore"
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

function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const navigate = useNavigate()

  function Submit() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/signin")
        toast.success(
          "Registration successful! Please login with your credentials"
        )

        const users = collection(db, "users")

        try {
          setDoc(doc(users, userCredential.user.uid), {
            firstName: firstName,
            lastName: lastName,
            email: email,
          })
        } catch (e) {
          console.log("Error adding user data", e)
        }
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          toast.error("Email already in use")
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
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "black" }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box sx={{ mt: 3 }}>
            {/* <Grid container spacing={2}> */}
            {/* <Grid item xs={12}> */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* </Grid>
              <Grid item xs={12}> */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {/* </Grid> */}
            {/* </Grid> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={Submit}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link to={"/signin"}>Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Signup
