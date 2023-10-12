import React, { useState } from "react"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
import { Button, FormControl, Grid, Typography } from "@mui/material"
import { useUserContext } from "../context/user-context"
import AppLoading from "../common/loading"
import HardestGradeDisplay from "./redpoint-grade-display"
import SelectFilter from "../common/select-filter"
import ActivityGraph from "./activity-graph"
import SectionLegend from "../common/section-legend"
import { DateFilters, PromiseTrackerArea } from "../../static/constants"
import { ThemeColors } from "../../static/styles"

export default function Dashboard() {
  const { userClimbingLogs } = useUserContext()
  const navigate = useNavigate()
  const [activityFilter, setActivityFilter] = useState<number>(
    DateFilters.ThisWeek
  )

  return !userClimbingLogs ? (
    <AppLoading />
  ) : (
    <>
      <Typography
        color={ThemeColors.darkShade}
        fontFamily={"poppins"}
        gutterBottom
        paddingTop={2}
        variant="h3"
      >
        Dashboard
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <Button
          onClick={() => navigate("/user/logClimb")}
          size="large"
          variant="contained"
          sx={{
            background: ThemeColors.darkAccent,
            fontFamily: "poppins",
            ":hover": { backgroundColor: ThemeColors.darkShade },
            textTransform: "none",
            fontSize: "14pt",
          }}
        >
          Log a climb
        </Button>
      </FormControl>

      <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        justifySelf={{ md: "center" }}
        padding={2}
        border={1}
        borderColor={ThemeColors.darkShade}
        sx={{ backgroundColor: "white", borderRadius: 2 }}
      >
        <Typography
          color={ThemeColors.darkShade}
          fontFamily={"poppins"}
          gutterBottom
          textAlign={"center"}
          variant="h5"
        >
          Redpoint Grades
        </Typography>
        <Grid container direction={"row"} justifyContent={"center"}>
          <Grid item xs>
            <HardestGradeDisplay climbType="Boulder" />
          </Grid>
          <Grid item md={2} xs={4}>
            <HardestGradeDisplay climbType="Lead" />
          </Grid>
          <Grid item xs>
            <HardestGradeDisplay climbType="TopRope" />
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        direction={"column"}
        marginTop={2}
        padding={2}
        border={1}
        borderColor={ThemeColors.darkShade}
        borderRadius={2}
        sx={{ backgroundColor: "white" }}
      >
        <Grid
          alignItems={"center"}
          container
          direction={"row"}
          display={"grid"}
          gridTemplateColumns={"1fr 1fr 1fr"}
          gridAutoRows={"auto"}
        >
          <Typography
            color={ThemeColors.darkShade}
            fontFamily={"poppins"}
            gutterBottom
            gridColumn={{ sm: "2", xs: "1" }}
            justifySelf={{ sm: "center", xs: "start" }}
            paddingLeft={{ sm: 0, xs: 2 }}
            variant="h5"
          >
            Activity
          </Typography>

          <Grid item gridColumn={"3"} gridRow={"1"} justifySelf={"end"}>
            <SelectFilter
              graph={PromiseTrackerArea.Activity}
              dateFilter={true}
              setFilter={setActivityFilter}
            />
          </Grid>
        </Grid>

        <Grid container item direction={"row"} alignItems={"center"}>
          <ActivityGraph filter={activityFilter} />
        </Grid>

        <SectionLegend section="activity" />
      </Grid>
    </>
  )
}
