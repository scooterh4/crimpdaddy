import React, { useEffect, useState } from "react"
import { Grid, Typography } from "@mui/material"
import { useProtectedContext } from "../protected-context"

type Props = {
  climbType: string
}

export default function HardestGradeDisplay({ climbType }: Props) {
  const { userIndoorRedpointGrades } = useProtectedContext()
  const [hardestGrade, setHardestGrade] = useState("--")
  const title = climbType === "TopRope" ? "Top Rope" : climbType

  useEffect(() => {
    if (userIndoorRedpointGrades) {
      switch (climbType) {
        case "Boulder":
          setHardestGrade(
            userIndoorRedpointGrades.boulder
              ? userIndoorRedpointGrades.boulder
              : "--"
          )
          break
        case "Lead":
          setHardestGrade(
            userIndoorRedpointGrades.lead ? userIndoorRedpointGrades.lead : "--"
          )
          break
        case "TopRope":
          setHardestGrade(
            userIndoorRedpointGrades.topRope
              ? userIndoorRedpointGrades.topRope
              : "--"
          )
          break
      }
    }
  }, [userIndoorRedpointGrades])

  return (
    <Grid container direction={"column"} gridAutoRows={"auto"}>
      <Typography
        gridRow={1}
        variant="h5"
        sx={{
          fontFamily: "poppins",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {hardestGrade}
      </Typography>
      <Typography
        gridRow={2}
        sx={{ fontFamily: "poppins", textAlign: "center" }}
      >
        {title}
      </Typography>
    </Grid>
  )
}
