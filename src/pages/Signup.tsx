import React from "react";
import { Avatar, Box, Container, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function Submit() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/signin");
        toast.success(
          "Registration successful! Please login with your credentials"
        );
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          toast.error("Email already in use");
        } else {
          toast.error("Uh oh! An unexpected error occurred");
          console.log(error.code, error.message);
        }
      });
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      Submit();
    }
  };

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
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
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
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={Submit}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to={"/signin"}>Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Signup;
