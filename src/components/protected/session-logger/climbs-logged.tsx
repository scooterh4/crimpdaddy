import React, { useEffect, useMemo, useState } from "react"
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
import {
  useBoulderData,
  useRouteData,
  useSessionAPI,
} from "./session-logger-context"

type Props = {
  title: string
  // sessionData: ClimbLog[]
  // openDialog(climbType: number): void
}

export function ClimbsLogged({ title }: Props) {
  const sessionData = title === "Boulders" ? useBoulderData() : useRouteData()
  const { onOpenAddClimbDialog } = useSessionAPI()
  const [dense, setDense] = useState(false)
  const [expand, setExpand] = React.useState(true)
  const [secondary, setSecondary] = useState(false)
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  const handleExpand = () => {
    setExpand(!expand)
  }

  function addClimb() {
    title === "Boulders" ? onOpenAddClimbDialog(0) : onOpenAddClimbDialog(1)
  }

  useEffect(() => {
    setDense(xsScreen)
  }, [xsScreen])

  console.log("Climbs-logged component render")

  return (
    <Grid
      border={1}
      borderRadius={2}
      item
      marginBottom={1}
      marginTop={1}
      padding={2}
      sx={{ backgroundColor: "white" }}
    >
      <Grid
        container
        direction={"row"}
        display={"grid"}
        gridTemplateColumns={"1fr 16fr"}
      >
        <Grid item gridColumn={"1"} justifySelf={"start"}>
          <IconButton
            onClick={addClimb}
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
        </Grid>
        <Grid
          alignItems={"center"}
          container
          gridColumn={"2"}
          display={"grid"}
          gridTemplateColumns={"5fr 1fr"}
          onClick={handleExpand}
          sx={{
            ml: 1,
            pl: 1,
            pr: 2,
            ":hover": { backgroundColor: "lightgray", cursor: "pointer" },
          }}
        >
          <Grid item gridColumn={"1"} justifySelf={"start"}>
            <Typography component="div" fontFamily={"poppins"} variant="h6">
              {title} ({sessionData ? sessionData.length : 0})
            </Typography>
          </Grid>
          <Grid item gridColumn={"2"} justifySelf={"end"}>
            {expand ? <ExpandLess /> : <ExpandMore />}
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ marginTop: 2 }} />
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <List dense={dense}>
          {sessionData &&
            sessionData.map((climb, index) => (
              <ListItem key={index}>
                <ListItemButton>
                  <ListItemText
                    primary={climb.Grade}
                    secondary={climb.Tick}
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
