import React, { useEffect } from "react"
import darkenedBackground from "../images/quickdraws-unsplash_dark.svg"
import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import CheckIcon from "@mui/icons-material/Check"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import BarChartIcon from "@mui/icons-material/BarChart"
import { useNavigate } from "react-router-dom"
import { AppColors, ThemeColors } from "../styles/styles"
import AppFooter from "../components/common/app-footer"
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"

type AdditionalInfo = {
  title: string
  body: string
  icon: ReactJSXElement
}

const additionalInfo: AdditionalInfo[] = [
  {
    title: "Log your climbs.",
    body: "Easily log your climbs while at the gym.",
    icon: (
      <CheckIcon
        sx={{
          color: AppColors.success,
          marginBottom: 2,
          marginLeft: 1,
          transform: "scale(2.0)",
        }}
      />
    ),
  },
  {
    title: "Track your progress.",
    body: "See your progression using our custom data graphs.",
    icon: (
      <BarChartIcon
        sx={{
          color: AppColors.info,
          marginBottom: 2,
          marginLeft: 1,
          transform: "scale(2.0)",
        }}
      />
    ),
  },
  {
    title: "See results.",
    body: "Watch yourself improve over time.",
    icon: (
      <TrendingUpIcon
        sx={{
          color: AppColors.warning,
          marginBottom: 2,
          marginLeft: 1,
          transform: "scale(2.0)",
        }}
      />
    ),
  },
]

type ButtonStyle = {
  title: string
  color: string
  hoverColor: string
  navigatePath: string
}

const mainButtons: ButtonStyle[] = [
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
    navigatePath: "/signup",
  },
]

function Landing() {
  const isAuthenticated = !!sessionStorage.getItem("Auth Token")
  const navigate = useNavigate()
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))
  const headerSize = xsScreen ? "h2" : "h1"

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [])

  return (
    <Box
      flexDirection={"column"}
      sx={{
        display: "flex",
      }}
    >
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
            fontFamily={"poppins"}
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

      <Typography
        gridRow={"1"}
        fontFamily={"poppins"}
        marginTop={10}
        textAlign={"center"}
        variant={"h3"}
        color={AppColors.primary}
      >
        Try hard and see results
      </Typography>

      <Grid container direction={"row"} marginTop={5} marginBottom={10}>
        {additionalInfo.map((item) => (
          <Grid
            key={item.title}
            item
            container
            direction={"column"}
            alignItems={"center"}
            lg={4}
            xs={12}
          >
            <Grid
              alignItems={{ lg: "start", xs: "center" }}
              container
              display={"flex"}
              direction={"column"}
              marginTop={{ lg: 0, xs: 5 }}
              width={{ lg: "30vw", xs: "100%" }}
              padding={2}
            >
              {item.icon}
              <Typography
                fontFamily={"poppins"}
                marginBottom={2}
                variant={"h4"}
                color={AppColors.primary}
              >
                {item.title}
              </Typography>
              <Typography
                fontFamily={"poppins"}
                variant={"h6"}
                color={AppColors.primary}
              >
                {item.body}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <AppFooter isAuthenticated={false} />
    </Box>
  )
}

export default Landing
