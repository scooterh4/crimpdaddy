import { Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { AppColors } from "../../../static/styles"
import { useAddClimbTypeContext } from "./session-logger-context"
import {
  BOULDER_TICK_TYPES,
  GYM_CLIMB_TYPES,
  ROUTE_TICK_TYPES,
} from "../../../static/constants"

type Props = {
  selectedTick: string
}

export default function TickDescription({ selectedTick }: Props) {
  const climbType = useAddClimbTypeContext()
  const [selectedTickDescription, setSelectedTickDescription] = useState("")
  const noun = climbType === GYM_CLIMB_TYPES.Boulder ? "problem" : "route"
  const tickDescriptions = {
    Onsight: `You completed the ${noun} on your first attempt without any prior knowledge of how to complete it.`,
    Flash: `You completed the ${noun} on your first attempt${
      climbType === GYM_CLIMB_TYPES.Boulder
        ? "."
        : " but had prior knowledge of how to complete it."
    }`,
    Redpoint: `You completed the ${noun} but it was not your first attempt.`,
    Repeat: `You have already completed the ${noun} and sent it again.`,
    Attempt: `You did not completed the ${noun}.`,
  }

  useEffect(() => {
    switch (selectedTick) {
      case ROUTE_TICK_TYPES.Onsight:
        setSelectedTickDescription(tickDescriptions.Onsight)
        break

      case ROUTE_TICK_TYPES.Flash:
        setSelectedTickDescription(tickDescriptions.Flash)
        break

      case ROUTE_TICK_TYPES.Redpoint:
        setSelectedTickDescription(tickDescriptions.Redpoint)
        break

      case BOULDER_TICK_TYPES.Send:
        setSelectedTickDescription(tickDescriptions.Redpoint)
        break

      case BOULDER_TICK_TYPES.Repeat:
        setSelectedTickDescription(tickDescriptions.Repeat)
        break

      case BOULDER_TICK_TYPES.Attempt:
        setSelectedTickDescription(tickDescriptions.Attempt)
        break

      default:
        setSelectedTickDescription("")
        break
    }
  }, [selectedTick])

  return (
    <Typography
      border={1}
      borderRadius={2}
      fontWeight={"bold"}
      marginTop={5}
      textAlign={"center"}
      padding={2}
      variant="h6"
      sx={{ color: AppColors.info, backgroundColor: "white" }}
    >
      {selectedTickDescription}
    </Typography>
  )
}
