import React from "react"
import { Grid } from "@mui/material"
import { GraphColors } from "../../../../static/styles"
import { GYM_CLIMB_TYPES } from "../../../../static/constants"
import LegendEntry from "./legend-entry"

type Props = {
  section: string
  climbType?: number | undefined
}

export default function SectionLegend({ section, climbType }: Props) {
  return (
    <Grid
      container
      justifyContent={"center"}
      direction={"row"}
      spacing={2}
      sx={{ display: "inline-flex" }}
    >
      {(section === "activity" || section === "progression") && (
        <LegendEntry
          title={"Climbs"}
          color={GraphColors.Sends}
          display={"inline-flex"}
        />
      )}

      {section === "gradePyramids" && climbType !== GYM_CLIMB_TYPES.Boulder && (
        <LegendEntry
          title={"Onsight"}
          color={GraphColors.Onsight}
          display={"inline-flex"}
        />
      )}

      {section === "gradePyramids" && (
        <LegendEntry
          title={"Flash"}
          color={GraphColors.Flash}
          display={"inline-flex"}
        />
      )}

      {section === "gradePyramids" && climbType !== GYM_CLIMB_TYPES.Boulder && (
        <LegendEntry
          title={"Redpoint"}
          color={GraphColors.Redpoint}
          display={"inline-flex"}
        />
      )}

      {section === "gradePyramids" && climbType === GYM_CLIMB_TYPES.Boulder && (
        <LegendEntry
          title="Sends"
          color={GraphColors.Sends}
          display="inline-flex"
        />
      )}

      <LegendEntry
        title={"Attempts"}
        color={GraphColors.Attempts}
        display="inline-flex"
      />
    </Grid>
  )
}
