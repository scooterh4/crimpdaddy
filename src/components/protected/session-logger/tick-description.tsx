import { Typography } from "@mui/material"
import React, { useMemo, useState } from "react"
import { AppColors } from "../../../static/styles"

const tickDescriptions = {
  Onsight:
    "You completed the route on your first attempt without any prior knowledge of how to complete it.",
  Flash:
    "You completed the route on your first attempt but had prior knowledge of how to complete it.",
  Redpoint: "You completed the route but it was not your first attempt.",
  Repeat: "You have already completed the route and sent it again.",
  Attempt: "You did not completed the route.",
}

type Props = {
  selectedTick: string
}

export default function TickDescription({ selectedTick }: Props) {
  const [selectedTickDescription, setSelectedTickDescription] = useState("")

  useMemo(() => {
    switch (selectedTick) {
      case "Onsight":
        setSelectedTickDescription(tickDescriptions.Onsight)
        break

      case "Flash":
        setSelectedTickDescription(tickDescriptions.Flash)
        break

      case "Redpoint":
        setSelectedTickDescription(tickDescriptions.Redpoint)
        break

      case "Repeat":
        setSelectedTickDescription(tickDescriptions.Repeat)
        break

      case "Attempt":
        setSelectedTickDescription(tickDescriptions.Attempt)
        break

      default:
        setSelectedTickDescription("")
        break
    }
  }, [])

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
