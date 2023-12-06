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
import { AppColors, AppFont } from "../../static/styles"
import DashboardIcon from "@mui/icons-material/Dashboard"
import BallotIcon from "@mui/icons-material/Ballot"
import EqualizerIcon from "@mui/icons-material/Equalizer"
import LogoutIcon from "@mui/icons-material/Logout"
import ShowChartIcon from "@mui/icons-material/ShowChart"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../app/context/auth-context"
import { Routes } from "../../router"

export default function AppDrawer() {
  const { user, logoutUser } = useAuthContext()
  const navigate = useNavigate()

  return (
    <div>
      <Toolbar sx={{ background: "white", color: AppColors.primary }}>
        <Typography fontFamily={AppFont} textAlign={"center"} variant={"h6"}>
          CrimpDaddy
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ background: "white", color: AppColors.primary }}>
        <ListItem
          disablePadding
          key="dashboard"
          onClick={() => navigate(Routes.dashboard)}
        >
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={"Dashboard"} sx={{ fontFamily: AppFont }} />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          key="sessionLogs"
          onClick={() => navigate(Routes.sessionLogs)}
        >
          <ListItemButton>
            <ListItemIcon>
              <BallotIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Session Logs"}
              sx={{ fontFamily: AppFont }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          key="grades"
          onClick={() => navigate(Routes.gradePyramids)}
        >
          <ListItemButton>
            <ListItemIcon>
              <EqualizerIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Grade Pyramids"}
              sx={{ fontFamily: AppFont }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          key="progress"
          onClick={() => navigate(Routes.progression)}
        >
          <ListItemButton>
            <ListItemIcon>
              <ShowChartIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Progression"}
              sx={{ fontFamily: AppFont }}
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
            <ListItemText primary={"Logout"} sx={{ fontFamily: AppFont }} />
          </ListItemButton>
        </ListItem>
      </List>
      {user && (
        <Typography
          fontFamily={AppFont}
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
