import * as React from "react"
import BottomNavigation from "@mui/material/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction"
import FolderIcon from "@mui/icons-material/Folder"
import RestoreIcon from "@mui/icons-material/Restore"
import FavoriteIcon from "@mui/icons-material/Favorite"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { Grid, Typography } from "@mui/material"
import { AppColors } from "../../static/styles"

export default function LabelBottomNavigation() {
  return (
    <BottomNavigation
      sx={{
        background: AppColors.primary,
        marginTop: 5,
        alignContent: "center",
      }}
    >
      <Grid
        container
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography color={"white"}>CrimpDaddy</Typography>

        {/* <a href="https://www.flaticon.com/free-icons/rock" title="rock icons">
          Rock icons created by Freepik - Flaticon
        </a> */}
      </Grid>
    </BottomNavigation>
  )
}
