import React, { useContext } from "react"
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material"
import { AppColors } from "../../static/styles"
import DashboardIcon from "@mui/icons-material/Dashboard"
import EqualizerIcon from "@mui/icons-material/Equalizer"
import LogoutIcon from "@mui/icons-material/Logout"
import ShowChartIcon from "@mui/icons-material/ShowChart"
import { signOut } from "firebase/auth"
import { toast } from "react-toastify"
import { auth } from "../../firebase"
import { UserContext } from "../../db/Context"

function AppDrawer() {
  const { user, updateUser } = useContext(UserContext)

  function handleLogout() {
    if (user) {
      signOut(auth)
        .then(() => {
          sessionStorage.removeItem("Auth Token")
          updateUser(null)
          toast.success("Goodbye!", { toastId: "logoutSuccess" })
        })
        .catch((error) => {
          console.log(error.code, error.message)
        })
    }
  }

  return (
    <div>
      <Toolbar sx={{ color: AppColors.primary }}>
        <Typography fontFamily={"poppins"} textAlign={"center"} variant={"h6"}>
          CrimpDaddy
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ color: AppColors.primary }}>
        <ListItem disablePadding key="dashboard">
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Dashboard"}
              sx={{ fontFamily: "poppins" }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding key="grades">
          <ListItemButton>
            <ListItemIcon>
              <EqualizerIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Grade Pyramids"}
              sx={{ fontFamily: "poppins" }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem key="progress" disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ShowChartIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Progression"}
              sx={{ fontFamily: "poppins" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List sx={{ color: AppColors.primary }}>
        <ListItem disablePadding key="logout" onClick={handleLogout}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Logout"} sx={{ fontFamily: "poppins" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )
}

export default AppDrawer
