import React from "react"
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { AccountCircle } from "@mui/icons-material"
import { signOut } from "firebase/auth"
import { auth } from "../../firebase"
import { AppUser } from "../../static/types"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

type ToolBarProps = {
  user:
    | {
        appUser: AppUser | null
        updateUser: (newUser: AppUser | null) => void
      }
    | undefined
}

function ToolBar({ user }: ToolBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
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

  return (
    <AppBar position="static" sx={{ background: "#DDD1CF", color: "black" }}>
      <Container maxWidth="xl">
        <Toolbar>
          {user && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            {user && (
              <Typography variant="h6" component="div">
                {user.appUser && user.appUser.email}
              </Typography>
            )}
            {!user && (
              <IconButton
                size="large"
                color="inherit"
                aria-label="menu"
                onClick={() => navigate("/")}
              >
                CrimpDaddy
              </IconButton>
            )}
          </Box>

          {user && (
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
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
              {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default ToolBar