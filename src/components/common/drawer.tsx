import React from "react"
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
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../context/auth-context"

export default function AppDrawer() {
  const { user, logoutUser } = useAuthContext()
  const navigate = useNavigate()

  return (
    <div>
      <Toolbar sx={{ background: "white", color: AppColors.primary }}>
        <Typography fontFamily={"poppins"} textAlign={"center"} variant={"h6"}>
          CrimpDaddy
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ background: "white", color: AppColors.primary }}>
        <ListItem
          disablePadding
          key="dashboard"
          onClick={() => navigate("/user/dashboard")}
        >
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
        <ListItem
          disablePadding
          key="grades"
          onClick={() => navigate("/user/gradePyramids")}
        >
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
        <ListItem
          disablePadding
          key="progress"
          onClick={() => navigate("/user/progression")}
        >
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
      <List sx={{ background: "white", color: AppColors.primary }}>
        <ListItem disablePadding key="logout" onClick={logoutUser}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Logout"} sx={{ fontFamily: "poppins" }} />
          </ListItemButton>
        </ListItem>
      </List>
      {user && (
        <Typography
          fontFamily={"poppins"}
          paddingLeft={1}
          sx={{
            background: "white",
            color: AppColors.primary,
            position: "fixed",
            bottom: 0,
            textAlign: "center",
          }}
        >
          {user.email ? user.email : ""}
        </Typography>
      )}
    </div>
  )
}
