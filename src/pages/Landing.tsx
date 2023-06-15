import React from "react";
import background from "../images/quickdraws-unsplash.jpg";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Landing() {
  let navigate = useNavigate();

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
        <div
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

        <div
          style={{
            backgroundColor: "#F0F0F099",
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
            <Typography variant="h2" fontFamily={"poppins"}>
              Log your climbs
            </Typography>
          </Box>
          <Box style={{ display: "block", marginBottom: 24 }}>
            <Typography variant="h2" fontFamily={"poppins"}>
              Track your progress
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
            style={{ backgroundColor: "black", color: "white" }}
          >
            Login
          </Button>
        </div>
      </Box>
    </>
  );
}

export default Landing;
