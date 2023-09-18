import * as React from "react"
import BottomNavigation from "@mui/material/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction"
import FolderIcon from "@mui/icons-material/Folder"
import RestoreIcon from "@mui/icons-material/Restore"
import FavoriteIcon from "@mui/icons-material/Favorite"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { Grid, Typography } from "@mui/material"
import { AppColors, drawerWidth } from "../../static/styles"

export default function LabelBottomNavigation() {
  return (
    <BottomNavigation
      sx={{
        background: AppColors.primary,
        alignContent: "center",
        position: "relative",
        width: { lg: `calc(100% - ${drawerWidth}px)` },
        ml: { lg: `${drawerWidth}px` },
      }}
    >
      <Grid
        container
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography
          // marginLeft={{
          //   xl: 5,
          //   lg: 35,
          // }}
          color={"white"}
          fontFamily={"poppins"}
        >
          CrimpDaddy
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
