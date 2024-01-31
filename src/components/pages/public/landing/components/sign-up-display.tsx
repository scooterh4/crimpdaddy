import React from "react"
import { Button, Grid, Typography } from "@mui/material"
import { AppColors, AppFont, ThemeColors } from "../../../../../static/styles"
import { useNavigate } from "react-router-dom"

export default function SignUpDisplay() {
  const navigate = useNavigate()

  return (
    <Grid
      container
      flexDirection="row"
      display={"grid"}
      justifyContent={"center"}
      marginBottom={10}
      marginTop={10}
    >
      <Typography
        variant="h3"
        fontFamily={AppFont}
        color={AppColors.primary}
        padding={2}
        textAlign={"center"}
      >
        Ready to give it a go?
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate("/signup")}
        fullWidth={false}
        sx={{
          alignSelf: "center",
          backgroundColor: ThemeColors.darkAccent,
          color: "white",
          ":hover": { backgroundColor: ThemeColors.lightAccent },
          fontFamily: AppFont,
          margin: 2,
        }}
      >
        <Typography variant={"h5"} sx={{ textTransform: "none" }}>
          Sign up now
        </Typography>
      </Button>
    </Grid>
  )
}
