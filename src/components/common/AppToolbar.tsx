import React from "react"
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import AppDrawer from "./AppDrawer"
import { AppUser } from "../../static/types"
import { AppColors } from "../../static/styles"
import { useNavigate } from "react-router-dom"
//import { useNavigate } from "react-router-dom"

export type userObj =
  | {
      appUser: AppUser | null
      updateUser: (newUser: AppUser | null) => void
    }
  | undefined

type ToolBarProps = {
  title: string
  user: userObj
}

const drawerWidth = 250

function ToolBar({ title, user }: ToolBarProps) {
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
    <AppBar
      position="static"
      sx={{ background: AppColors.primary, color: "white" }}
    >
      <Container maxWidth="xl">
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

          <Box
            justifyContent={"center"}
            marginLeft={{
              xl: title === "Dashboard" ? 5 : 0,
              lg: title === "Dashboard" ? 35 : 0,
            }}
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
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

        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
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
        </Box>
      </Container>
    </AppBar>
  )
}

export default ToolBar
