import React, { useEffect, useState } from "react"
import { Square } from "@mui/icons-material"
import { Card, Grid, Typography } from "@mui/material"
import { GraphColors } from "../static/styles"
import { ClimbLog } from "../static/types"
import { BOULDER_GRADES, INDOOR_SPORT_GRADES } from "../static/constants"

export type HardestGradeProps = {
  climbType: string
  tickType: string
  climbingData: ClimbLog[]
}

function HardestGradeDisplay({
  climbType,
  tickType,
  climbingData,
}: HardestGradeProps) {
  const [hardestGrade, setHardestGrade] = useState("--")
  const gradingSystem =
    climbType === "Boulder" ? BOULDER_GRADES : INDOOR_SPORT_GRADES
  const title = tickType // + "ed"

  useEffect(() => {
    if (climbingData.length > 0) {
      const climbs = climbingData.filter(
        (climb) => climb.Tick === tickType && climb.ClimbType === climbType
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
  }, [climbingData])

  return (
    <>
      <Typography>{title}</Typography>
      <Typography sx={{ textAlign: "center" }}>{hardestGrade}</Typography>
    </>
  )
}

export default HardestGradeDisplay
