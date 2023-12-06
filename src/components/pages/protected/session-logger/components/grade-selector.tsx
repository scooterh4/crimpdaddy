import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material"
import React from "react"
import { AppColors, ThemeColors } from "../../../../../static/styles"
import Icon from "../../../../../images/belay.png"

type Props = {
  gradesList: string[]
  selectedGrade: string
  setSelectedGrade: React.Dispatch<React.SetStateAction<string>>
}

export default function GradeSelector({
  gradesList,
  selectedGrade,
  setSelectedGrade,
}: Props) {
  return (
    <ImageList
      sx={{
        gridAutoFlow: "column",
        gridTemplateColumns: "repeat(auto-fill,minmax(80px, 80px)) !important",
        gridAutoColumns: "minmax(80px, 80px)",
        maxWidth: "100%",
      }}
    >
      {gradesList.map((grade) => (
        <ImageListItem key={grade}>
          <IconButton
            aria-label={grade}
            onClick={() => setSelectedGrade(grade)}
          >
            <img
              src={Icon}
              style={{
                maxHeight: "50%",
                maxWidth: "50%",
                padding: 15,
              }}
            />

            <ImageListItemBar
              title={grade}
              sx={{
                backgroundColor:
                  selectedGrade === grade
                    ? ThemeColors.darkAccent
                    : AppColors.primary,
                ":hover": {
                  backgroundColor: ThemeColors.darkAccent,
                },
              }}
            />
          </IconButton>
        </ImageListItem>
      ))}
    </ImageList>
  )
}
