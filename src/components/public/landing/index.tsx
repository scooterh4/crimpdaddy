import React from "react"
import darkenedBackground from "../../../images/quickdraws-unsplash_dark.svg"
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
import { AppColors, ThemeColors } from "../../../static/styles"
import AppFooter from "../../common/footer"
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

export default function Landing() {
  const navigate = useNavigate()
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))
  const headerSize = xsScreen ? "h2" : "h1"

  return (
    <Box
      flexDirection={"column"}
      sx={{
        display: "flex",
      }}
    >
      <div style={{ backgroundColor: ThemeColors.darkShade }}>
        <Grid
          container
          alignContent={"center"}
          justifyContent={"center"}
          direction={"row"}
          height={"100vh"}
          sx={{
            position: "relative",
            backgroundSize: { xl: "contain", xs: "cover" },
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
      </div>

      <Typography
        gridRow={"1"}
        fontFamily={"poppins"}
        marginTop={10}
        textAlign={"center"}
        padding={2}
        variant={"h3"}
        color={AppColors.primary}
      >
        Try hard and see results
      </Typography>

      <Grid
        container
        direction="row"
        marginTop={{ lg: 10, xs: 5 }}
        marginBottom={10}
      >
        {additionalInfo.map((item, index) => (
          <Grid
            key={item.title}
            container
            flexDirection={"row"}
            justifyContent={{
              lg: index === 1 ? "center" : "end",
              xs: "center",
            }}
            item
            lg={4}
            xs={12}
          >
            <Grid
              container
              direction="column"
              alignItems={{ lg: "start", xs: "center" }}
              display="flex"
              marginTop={{ lg: 0, xs: 5 }}
              width={{ lg: "30vw", xs: "100%" }}
              padding={2}
            >
              {item.icon}
              <Typography
                fontFamily="poppins"
                marginBottom={2}
                paddingLeft={{ sm: 0, xs: 2 }}
                paddingRight={{ sm: 0, xs: 2 }}
                variant="h4"
                color={AppColors.primary}
                textAlign={{ lg: "start", xs: "center" }}
              >
                {item.title}
              </Typography>
              <Typography
                fontFamily="poppins"
                variant="h6"
                color={AppColors.primary}
                textAlign={{ lg: "start", xs: "center" }}
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
