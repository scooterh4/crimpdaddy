import React from "react"
import background from "../images/quickdraws-unsplash.jpg"
import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useNavigate } from "react-router-dom"

function Landing() {
  let navigate = useNavigate()
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))
  const backdropFilter = xsScreen ? "" : "blur(5px) saturate(140%)"
  const boxShadow = xsScreen ? "" : "0px 25px 5px 0px rgba(0, 0, 0, 0.75)"

  return (
    <>
      <Box
        style={{
          height: "100vh",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* background image  */}
        <Grid
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            filter: "sepia(0.75)",
          }}
        />

        <Grid
          style={{
            backgroundColor: "#FFFFFF66",
            backdropFilter: backdropFilter,
            boxShadow: boxShadow,
            borderRadius: 24,
            zIndex: 1,
            margin: "0 auto",
            flexDirection: "column",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <Box style={{ display: "block", marginBottom: 24 }}>
            <Typography
              variant="h2"
              fontFamily={"poppins"}
              textAlign={"center"}
            >
              Log your climbs
            </Typography>
          </Box>
          <Box style={{ display: "block", marginBottom: 30 }}>
            <Typography
              variant="h2"
              fontFamily={"poppins"}
              textAlign={"center"}
            >
              Track your progress
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/signin")}
            style={{ backgroundColor: "black", color: "white" }}
          >
            Sign in
          </Button>
        </Grid>
      </Box>
    </>
  )
}

export default Landing
