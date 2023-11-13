import { Button, Grid, SvgIcon, useMediaQuery, useTheme } from "@mui/material"
import React from "react"
import { TICK_TYPES } from "../../../static/constants"
import VisibilityIcon from "@mui/icons-material/Visibility"
import BoltIcon from "@mui/icons-material/Bolt"
import CircleIcon from "@mui/icons-material/Circle"
import ReplayIcon from "@mui/icons-material/Replay"
import CancelIcon from "@mui/icons-material/Cancel"
import { AppColors, GraphColors, ThemeColors } from "../../../static/styles"

const tickIcons = [VisibilityIcon, BoltIcon, CircleIcon, ReplayIcon, CancelIcon]
const tickColors = [
  GraphColors.Onsight,
  GraphColors.Flash,
  GraphColors.Redpoint,
  AppColors.info,
  AppColors.danger,
]

type Props = {
  selectedTick: string
  setSelectedTick: React.Dispatch<React.SetStateAction<string>>
  setAttemptInputVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TickSelector({
  selectedTick,
  setSelectedTick,
  setAttemptInputVisibility,
}: Props) {
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  const tickButtonClicked = (event: React.MouseEvent<HTMLElement>) => {
    const value = event.currentTarget.getAttribute("value")

    if (value !== null) {
      setSelectedTick(value.toString())

      value.toString() === "Attempt"
        ? setAttemptInputVisibility(true)
        : setAttemptInputVisibility(false)
    }
  }

  return (
    <Grid alignItems={"center"} container direction={"column"}>
      <Grid
        container
        direction={"row"}
        justifyContent={{ sm: "start", xs: "center" }}
      >
        {TICK_TYPES.map((tick, index) => (
          <Button
            key={tick}
            value={tick}
            onClick={tickButtonClicked}
            sx={{
              backgroundColor:
                selectedTick === tick ? tickColors[index] : "white",
              color: selectedTick === tick ? "white" : tickColors[index],
              ":hover": {
                backgroundColor:
                  selectedTick === tick
                    ? tickColors[index]
                    : ThemeColors.darkAccent,
                color: "white",
              },
              marginTop: xsScreen && index > 2 ? 2 : 0,
              marginLeft: index > 0 ? 1 : 0,
              marginRight: 1,
            }}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"column"}
              justifyContent={"center"}
            >
              <SvgIcon
                component={tickIcons[index]}
                sx={{
                  color: selectedTick === tick ? "white" : tickColors[index],
                  ":hover": {
                    color: selectedTick === tick ? "white" : tickColors[index],
                  },
                }}
              />
              {tick}
            </Grid>
          </Button>
        ))}
      </Grid>
    </Grid>
  )
}
