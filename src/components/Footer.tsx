import React from "react"
import BottomNavigation from "@mui/material/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction"
import FolderIcon from "@mui/icons-material/Folder"
import RestoreIcon from "@mui/icons-material/Restore"
import FavoriteIcon from "@mui/icons-material/Favorite"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { Typography } from "@mui/material"

export default function LabelBottomNavigation() {
  return (
    <BottomNavigation
      sx={{
        background: "#DDD1CF",
        marginTop: 5,
        alignContent: "center",
      }}
    >
      <Typography color={"white"}>CrimpDaddy</Typography>

      {/* <BottomNavigationAction
        label="Recents"
        value="recents"
        icon={<RestoreIcon />}
      />
      <BottomNavigationAction
        label="Favorites"
        value="favorites"
        icon={<FavoriteIcon />}
      />
      <BottomNavigationAction
        label="Nearby"
        value="nearby"
        icon={<LocationOnIcon />}
      />
      <BottomNavigationAction
        label="Folder"
        value="folder"
        icon={<FolderIcon />}
      /> */}
    </BottomNavigation>
  )
}
