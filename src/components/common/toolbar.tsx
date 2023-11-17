import React from "react"
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import AppDrawer from "./drawer"
import { AppColors, drawerWidth } from "../../static/styles"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuthContext } from "../app/context/auth-context"
import { Routes } from "../../router"

type Props = {
  title: string
}

export default function ToolBar({ title }: Props) {
  const user = useAuthContext()
  const header = title === "Dashboard" ? "Gym Climbing" : "CrimpDaddy"
  const cursor = title === "Dashboard" ? "" : "pointer"
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const lgScreenAndUp = useMediaQuery(theme.breakpoints.up("lg"))

  const barWidth =
    location.pathname !== Routes.climbSession
      ? lgScreenAndUp
        ? `calc(100% - ${drawerWidth}px)`
        : "100%"
      : "100%"
  const barMl =
    location.pathname !== Routes.climbSession
      ? lgScreenAndUp
        ? `${drawerWidth}px`
        : 0
      : 0

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  function headerClicked() {
    if (header === "CrimpDaddy") {
      navigate(Routes.landing)
    }
  }

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: AppColors.primary,
          color: "white",
          width: title !== "" ? barWidth : {},
          ml: title !== "" ? barMl : {},
        }}
      >
        <Toolbar>
          {user.user && location.pathname !== Routes.climbSession && (
            <IconButton
              aria-label="menu"
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              size="large"
              sx={{
                display: { lg: "none" },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box alignItems={"center"} sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography
              variant="h5"
              fontFamily={"poppins"}
              marginTop={1}
              component="div"
              gutterBottom
              onClick={headerClicked}
              sx={{ cursor: cursor }}
            >
              {header}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {title !== "" && location.pathname !== Routes.climbSession && (
        <Box
          component="nav"
          sx={{
            width: { lg: drawerWidth },
            flexShrink: { lg: 0 },
          }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", lg: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <AppDrawer />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", lg: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            <AppDrawer />
          </Drawer>
        </Box>
      )}
    </>
  )
}
