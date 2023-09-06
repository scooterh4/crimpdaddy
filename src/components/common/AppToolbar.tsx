import React, { useContext } from "react"
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import AppDrawer from "./AppDrawer"
import { AppColors, drawerWidth } from "../../static/styles"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context-api"

type ToolBarProps = {
  title: string
}

function ToolBar({ title }: ToolBarProps) {
  const { user } = useContext(UserContext)
  const header = title === "Dashboard" ? "Gym Climbing" : "CrimpDaddy"
  const cursor = title === "Dashboard" ? "" : "pointer"
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  function headerClicked() {
    if (header === "CrimpDaddy") {
      navigate("/")
    }
  }

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: AppColors.primary,
          color: "white",
          width: title !== "" ? { lg: `calc(100% - ${drawerWidth}px)` } : {},
          ml: title !== "" ? { lg: `${drawerWidth}px` } : {},
        }}
      >
        <Toolbar>
          {user && (
            <IconButton
              aria-label="menu"
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              size="large"
              sx={{ display: { lg: "none" } }}
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
            >
              {header}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {title !== "" && (
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

export default ToolBar
