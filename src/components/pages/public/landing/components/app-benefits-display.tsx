import React from "react"
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import CheckIcon from "@mui/icons-material/Check"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import BarChartIcon from "@mui/icons-material/BarChart"
import { AppColors, AppFont } from "../../../../../static/styles"
import { Grid, Typography } from "@mui/material"

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

export default function AppBenefitsDisplay() {
  return (
    <>
      <Typography
        gridRow={"1"}
        fontFamily={AppFont}
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
                fontFamily={AppFont}
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
                fontFamily={AppFont}
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
    </>
  )
}
