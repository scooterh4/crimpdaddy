import React from "react"
import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { AccountCircle } from "@mui/icons-material"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { AppUser } from "../static/types"
import { toast } from "react-toastify"

type ToolBarProps = {
  updateUser: (newUser: AppUser | null) => void
}

function ToolBar({ updateUser }: ToolBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  function handleLogout() {
    console.log("logout")
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

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          {/* <MenuIcon /> */}
        </IconButton>

        {/* Best way I can space the user icon to the right */}
        <Box sx={{ flexGrow: 1 }} />

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
      </Toolbar>
    </AppBar>
  )
}

export default ToolBar
