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
import { ThemeColors } from "../../../static/styles"
import {
  useBoulderData,
  useRouteData,
  useSessionAPI,
} from "./session-logger-context"
import { EditSessionClimb, SessionClimb } from "../../../static/types"
import ConfirmDeleteClimbDialog from "./confirm-delete-climb-dialog"
import { GYM_CLIMB_TYPES } from "../../../static/constants"

type Props = {
  title: string
}

export function ClimbsLoggedDisplay({ title }: Props) {
  const {
    onOpenAddClimbDialog,
    onOpenEditClimbDialog,
    onOpenDeleteClimbDialog,
  } = useSessionAPI()
  const sessionData = title === "Boulders" ? useBoulderData() : useRouteData()
  const [dense, setDense] = useState(false)
  const [expand, setExpand] = React.useState(true)
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  useEffect(() => {
    setDense(xsScreen)
  }, [xsScreen])

  const handleExpand = () => {
    setExpand(!expand)
  }

  function addClimb() {
    title === "Boulders"
      ? onOpenAddClimbDialog(GYM_CLIMB_TYPES.Boulder)
      : onOpenAddClimbDialog(GYM_CLIMB_TYPES.Lead)
  }

  function editClimb(climb: SessionClimb, index: number) {
    onOpenEditClimbDialog({ ...climb, index: index } as EditSessionClimb)
  }

  function openDeleteDialog(climb: SessionClimb, index: number) {
    onOpenDeleteClimbDialog(climb, index)
  }

  function getPrimaryText(climb: SessionClimb) {
    return climb.climbType !== GYM_CLIMB_TYPES[0]
      ? climb.climbType === GYM_CLIMB_TYPES[1]
        ? `${climb.climbType}: ${climb.grade} `
        : `Top rope: ${climb.grade}`
      : climb.grade
  }

  function getSecondaryText(climb: SessionClimb) {
    return climb.tick === "Attempt"
      ? `${climb.attemptCount} ${climb.tick}` +
          (climb.attemptCount > 1 ? "s" : "")
      : `${climb.tick}${
          climb.attemptCount > 1
            ? ` (with ${climb.attemptCount - 1} failed attempt${
                climb.attemptCount > 2 ? "s" : ""
              })`
            : ""
        }`
  }

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
      <ConfirmDeleteClimbDialog />

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
                <ListItemButton onClick={() => editClimb(climb, index)}>
                  <ListItemText
                    primary={getPrimaryText(climb)}
                    secondary={getSecondaryText(climb)}
                    sx={{ fontFamily: "poppins" }}
                  />
                </ListItemButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => openDeleteDialog(climb, index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
        </List>
      </Collapse>
    </Grid>
  )
}
