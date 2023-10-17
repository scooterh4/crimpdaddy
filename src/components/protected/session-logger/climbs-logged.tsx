import React, { useEffect, useState } from "react"
import {
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { AppColors, ThemeColors } from "../../../static/styles"
import { ClimbLog } from "../../../static/types"

type Props = {
  title: string
}

export function ClimbsLogged({ title }: Props) {
  const [dense, setDense] = useState(false)
  const [expand, setExpand] = React.useState(true)
  const [secondary, setSecondary] = useState(false)
  const [sessionData, setSessionData] = useState<ClimbLog[]>([])
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  const handleExpand = () => {
    setExpand(!expand)
  }

  useEffect(() => {
    setDense(xsScreen)
  }, [xsScreen])

  return (
    <Grid
      border={1}
      borderRadius={2}
      item
      xs={12}
      md={6}
      marginBottom={1}
      marginTop={1}
      padding={2}
      sx={{ backgroundColor: "white" }}
    >
      <Grid container direction={"row"}>
        <IconButton
          edge="end"
          sx={{
            ":hover": {
              cursor: "pointer",
              backgroundColor: ThemeColors.darkAccent,
              color: "white",
            },
            fontSize: "5px",
          }}
        >
          <AddIcon />
        </IconButton>
        <Typography
          component="div"
          fontFamily={"poppins"}
          onClick={handleExpand}
          variant="h6"
          sx={{
            alignSelf: "center",
            ml: 2,
            mr: 1,
            ":hover": { backgroundColor: "lightgray", cursor: "pointer" },
          }}
        >
          {title} ({sessionData.length})
        </Typography>
        <Grid item alignSelf={"center"}>
          {expand ? <ExpandLess /> : <ExpandMore />}
        </Grid>
      </Grid>
      <Divider sx={{ marginTop: 2 }} />
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <List dense={dense}>
          {sessionData.map((climb) => (
            <ListItem>
              <ListItemButton>
                <ListItemText
                  primary={climb.Grade}
                  secondary="Secondary text"
                  sx={{ fontFamily: "poppins" }}
                />
              </ListItemButton>
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Grid>
  )
}
