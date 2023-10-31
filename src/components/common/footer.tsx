import * as React from "react"
import BottomNavigation from "@mui/material/BottomNavigation"
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import { AppColors, drawerWidth } from "../../static/styles"
import { useLocation } from "react-router-dom"
import { Routes } from "../../router"

type Props = {
  isAuthenticated: boolean
}

export default function LabelBottomNavigation({ isAuthenticated }: Props) {
  const location = useLocation()
  const theme = useTheme()
  const lgScreenAndUp = useMediaQuery(theme.breakpoints.up("lg"))

  const barWidth =
    location.pathname !== Routes.climbSession
      ? lgScreenAndUp
        ? isAuthenticated
          ? `calc(100% - ${drawerWidth}px)`
          : "100%"
        : "100%"
      : "100%"
  const barMl =
    location.pathname !== Routes.climbSession
      ? lgScreenAndUp
        ? isAuthenticated
          ? `${drawerWidth}px`
          : 0
        : 0
      : 0

  return (
    <BottomNavigation
      sx={{
        background: AppColors.primary,
        alignContent: "center",
        position: "relative",
        height: "100%",
        width: barWidth,
        ml: barMl,
      }}
    >
      <Grid
        container
        direction={"column"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        padding={1}
      >
        <Typography color={"white"} fontFamily={"poppins"} variant="body1">
          CrimpDaddy
        </Typography>
        <Typography color={"white"} fontFamily={"poppins"} variant="body2">
          2023
        </Typography>
        {/* <a href="https://www.flaticon.com/free-icons/rock" title="rock icons">
          Rock icons created by Freepik - Flaticon
        </a> */}
        {/* <a href="https://www.freepik.com/icon/belayer_10225991#fromView=keyword&term=Climbing&page=2&position=89">Icon by Vectors Tank</a> */}
        {/* <a href="https://www.freepik.com/icon/climbing_10225968#fromView=keyword&term=Climbing&page=2&position=12">Icon by Vectors Tank</a> */}
        {/* <a href="https://www.flaticon.com/free-icons/climbing" title="climbing icons">Climbing icons created by Sohell - Flaticon</a> */}
        {/* <a href="https://www.freepik.com/search?format=search&last_filter=page&last_value=3&page=3&query=climbing&type=icon">Icon by Freepik</a> */}
        {/* <a href="https://www.flaticon.com/free-icons/coal" title="coal icons">Coal icons created by Freepik - Flaticon</a> */}
      </Grid>
    </BottomNavigation>
  )
}
