import React, { useEffect, useState } from "react"
import { Grid, Typography } from "@mui/material"
import { ClimbLog } from "../../types"
import {
  BOULDER_GRADES,
  INDOOR_SPORT_GRADES,
  TICK_TYPES,
} from "../../constants"
import { useUserContext } from "../../context-api"

export type HardestGradeProps = {
  climbType: string
}

function HardestGradeDisplay({ climbType }: HardestGradeProps) {
  const {
    userBoulderLogs,
    userLeadLogs,
    userTopRopeLogs,
    userClimbingLogs,
  } = useUserContext()
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
    if (userClimbingLogs && userClimbingLogs.length > 0) {
      let climbingData: ClimbLog[] = []
      switch (climbType) {
        case "Boulder":
          climbingData = userBoulderLogs ? userBoulderLogs : []
          break
        case "Lead":
          climbingData = userLeadLogs ? userLeadLogs : []
          break
        case "TopRope":
          climbingData = userTopRopeLogs ? userTopRopeLogs : []
          break
      }

      const climbs = climbingData.filter(
        (climb) =>
          (climb.Tick === TICK_TYPES[0] ||
            climb.Tick === TICK_TYPES[1] ||
            climb.Tick === TICK_TYPES[2]) &&
          climb.ClimbType === climbType
      )

      if (climbs.length > 0) {
        const result = climbs.reduce((prev, current) =>
          gradingSystem.indexOf(prev.Grade) >
          gradingSystem.indexOf(current.Grade)
            ? prev
            : current
        )

        setHardestGrade(result.Grade)
      } else {
        setHardestGrade("--")
      }
    }
  }, [userClimbingLogs])

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
