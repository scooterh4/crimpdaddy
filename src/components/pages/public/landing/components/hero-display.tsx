import React from "react"
import {
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { AppColors, AppFont, ThemeColors } from "../../../../../static/styles"
import darkenedBackground from "../../../../../images/quickdraws-unsplash_dark.svg"
import { useNavigate } from "react-router-dom"

type ButtonStyles = {
  title: string
  color: string
  hoverColor: string
  navigatePath: string
}

const mainButtons: ButtonStyles[] = [
  {
    title: "Let's go",
    color: ThemeColors.darkAccent,
    hoverColor: ThemeColors.lightAccent,
    navigatePath: "/signup",
  },
  {
    title: "Login",
    color: AppColors.primary,
    hoverColor: ThemeColors.lightAccent,
    navigatePath: "/login",
  },
]

export default function HeroDisplay() {
  const navigate = useNavigate()
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))
  const headerSize = xsScreen ? "h2" : "h1"

  return (
    <div style={{ backgroundColor: ThemeColors.darkShade }}>
      <Grid
        container
        alignContent={"center"}
        justifyContent={"center"}
        direction={"row"}
        height={"100vh"}
        sx={{
          position: "relative",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: `url(${darkenedBackground})`,
        }}
      >
        <Grid
          item
          gridColumn={"1"}
          gridRow={{ sm: "1", xs: "2" }}
          container
          direction={"column"}
          alignContent={"center"}
          justifyContent={"center"}
        >
          <Typography
            variant={headerSize}
            color={"white"}
            fontFamily={AppFont}
            textAlign={"center"}
            padding={2}
          >
            Log Your Climbing Journey
          </Typography>
        </Grid>

        {mainButtons.map((button) => (
          <Button
            key={button.title}
            variant="contained"
            size="large"
            onClick={() => navigate(button.navigatePath)}
            sx={{
              alignSelf: "center",
              backgroundColor: button.color,
              color: "white",
              ":hover": { backgroundColor: button.hoverColor },
              margin: 2,
            }}
          >
            <Typography variant={"h6"} sx={{ textTransform: "none" }}>
              {button.title}
            </Typography>
          </Button>
        ))}
      </Grid>
    </div>
  )
}
