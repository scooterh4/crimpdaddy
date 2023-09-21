import React, { useEffect, useState } from "react"
import { Grid, Typography } from "@mui/material"
import { BOULDER_GRADES, INDOOR_SPORT_GRADES } from "../../constants"
import { useUserContext } from "../../context-api"

export type HardestGradeProps = {
  climbType: string
}

function HardestGradeDisplay({ climbType }: HardestGradeProps) {
  const { userIndoorRedpointGrades } = useUserContext()
  const [hardestGrade, setHardestGrade] = useState("--")
  const gradingSystem =
    climbType === "Boulder" ? BOULDER_GRADES : INDOOR_SPORT_GRADES
  const title = climbType === "TopRope" ? "Top Rope" : climbType
  // const icon =
  //   climbType === "Boulder"
  //     ? BoulderIcon
  //     : climbType === "Lead"
  //     ? LeadIcon
  //     : TrIcon

  useEffect(() => {
    if (userIndoorRedpointGrades) {
      switch (climbType) {
        case "Boulder":
          setHardestGrade(
            userIndoorRedpointGrades.Boulder
              ? userIndoorRedpointGrades.Boulder
              : "--"
          )
          break
        case "Lead":
          setHardestGrade(
            userIndoorRedpointGrades.Lead ? userIndoorRedpointGrades.Lead : "--"
          )
          break
        case "TopRope":
          setHardestGrade(
            userIndoorRedpointGrades.TopRope
              ? userIndoorRedpointGrades.TopRope
              : "--"
          )
          break
      }
    }
  }, [userIndoorRedpointGrades])

  return (
    // <Grid container direction={"row"} justifyContent={"center"}>
    //   <img src={icon} alt="boulder" height={30} width={30} />

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
    // </Grid>
  )
}

export default HardestGradeDisplay
