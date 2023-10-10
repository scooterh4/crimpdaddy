import * as React from "react"
import BottomNavigation from "@mui/material/BottomNavigation"
import { Grid, Typography } from "@mui/material"
import { AppColors, drawerWidth } from "../../static/styles"

type Props = {
  isAuthenticated: boolean
}

export default function LabelBottomNavigation({ isAuthenticated }: Props) {
  return (
    <BottomNavigation
      sx={{
        background: AppColors.primary,
        alignContent: "center",
        position: "relative",
        height: "100%",
        width: {
          lg: isAuthenticated ? `calc(100% - ${drawerWidth}px)` : "100%",
        },
        ml: { lg: isAuthenticated ? `${drawerWidth}px` : 0 },
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
