import React from "react"
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { AccountCircle } from "@mui/icons-material"
import AppDrawer from "./AppDrawer"
import { reload, signOut } from "firebase/auth"
import { auth } from "../../firebase"
import { AppUser } from "../../static/types"
import { toast } from "react-toastify"
import { AppColors } from "../../static/styles"
import { useNavigate } from "react-router-dom"
//import { useNavigate } from "react-router-dom"

type userObj =
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  function handleLogout() {
    console.log("logout")
    if (user) {
      signOut(auth)
        .then(() => {
          sessionStorage.removeItem("Auth Token")
          user.updateUser(null)
          toast.success("Goodbye!", { toastId: "logoutSuccess" })
        })
        .catch((error) => {
          console.log(error.code, error.message)
        })
    }
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

          {user && (
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
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
            {AppDrawer}
          </Drawer>
          {/* <Drawer
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
            {drawer}
          </Drawer> */}
        </Box>
      </Container>
    </AppBar>
  )
}

export default ToolBar
