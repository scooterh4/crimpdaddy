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
import InboxIcon from "@mui/icons-material/Inbox"
import MailIcon from "@mui/icons-material/Mail"

const AppDrawer = (
  <div>
    <Toolbar sx={{ color: AppColors.primary }}>
      <Typography fontFamily={"poppins"} textAlign={"center"} variant={"h6"}>
        CrimpDaddy
      </Typography>
    </Toolbar>
    <Divider />
    <List sx={{ color: AppColors.primary }}>
      {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
    <Divider />
    <List sx={{ color: AppColors.primary }}>
      {["All mail", "Trash", "Spam"].map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </div>
)

export default AppDrawer
