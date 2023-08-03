import * as React from "react"
import BottomNavigation from "@mui/material/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction"
import FolderIcon from "@mui/icons-material/Folder"
import RestoreIcon from "@mui/icons-material/Restore"
import FavoriteIcon from "@mui/icons-material/Favorite"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { Grid, Typography } from "@mui/material"

export default function LabelBottomNavigation() {
  return (
    <BottomNavigation
      sx={{
        background: "#DDD1CF",
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
      </Grid>
    </BottomNavigation>
  )
}
