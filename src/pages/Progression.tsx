import { Container, Drawer, Grid, Typography } from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import SectionLegend from "../components/dashboard/SectionLegend"
import { ThemeColors } from "../static/styles"
import { ClimbGraphData, ClimbLog } from "../static/types"
import { UserContext } from "../db/Context"
import { GetAllUserClimbs } from "../db/ClimbLogService"
import ReactLoading from "react-loading"
import AppToolbar from "../components/common/AppToolbar"
import AppDrawer from "../components/common/AppDrawer"
import ProgressionGraph from "../components/dashboard/ProgressionGraph"
import { GYM_CLIMB_TYPES } from "../static/constants"
import SelectFilter from "../components/dashboard/SelectFilter"
import AppFooter from "../components/common/AppFooter"

function ProgressionPage() {
  const { user, updateUser } = useContext(UserContext)
  const [climbingData, setClimbingData] = useState<ClimbLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [boulderProgressionFilter, setBoulderProgressionFilter] = useState<
    string
  >("last6Months")
  const [leadProgressionFilter, setLeadProgressionFilter] = useState<string>(
    "last6Months"
  )
  const [trProgressionFilter, setTrProgressionFilter] = useState<string>(
    "last6Months"
  )

  useEffect(() => {
    if (user) {
      // on the initial dashboard load, the progression graph needs the last 6 months
      GetAllUserClimbs(user.id, "last6Months").then((data) => {
        setClimbingData(data.climbingData)
        setIsLoading(false)
      })
    }
  }, [user])

  const drawerWidth = 250

  return isLoading ? (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      direction="row"
      sx={{ height: "100vh" }}
    >
      <Grid item>
        <ReactLoading
          type="spin"
          color={ThemeColors.darkAccent}
          height={200}
          width={100}
        />
      </Grid>
    </Grid>
  ) : (
    <>
      <AppToolbar title={"Dashboard"} />

      <Container sx={{ display: "flex" }}>
        <Grid
          aria-label="mailbox folders"
          container
          direction={"column"}
          sx={{ width: { lg: drawerWidth, xs: 0 } }}
        >
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", lg: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            <AppDrawer />
          </Drawer>
        </Grid>

        <Grid
          container
          direction={"column"}
          marginLeft={{ xl: -15 }}
          sx={{
            width: { lg: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
          }}
        >
          <Typography
            component="div"
            fontFamily={"poppins"}
            gutterBottom
            marginTop={6}
            textAlign={"center"}
            variant="h4"
          >
            Progression
          </Typography>
          <Grid
            border={1}
            borderColor={ThemeColors.darkAccent}
            borderRadius={5}
            container
            direction={"column"}
            padding={2}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"row"}
              display={"grid"}
              gridAutoRows={"auto"}
              gridTemplateColumns={"1fr 1fr 1fr"}
            >
              <Typography
                color={ThemeColors.darkShade}
                fontFamily={"poppins"}
                gridColumn={{ sm: "2", xs: "1" }}
                gutterBottom
                justifySelf={{ sm: "center", xs: "start" }}
                paddingLeft={{ sm: 0, xs: 2 }}
                variant="h6"
              >
                Bouldering
              </Typography>

              <Grid item gridColumn={"3"} gridRow={"1"} justifySelf={"end"}>
                <SelectFilter
                  dashboardSection="progression"
                  selectedFilter={boulderProgressionFilter}
                  setFilter={setBoulderProgressionFilter}
                />
              </Grid>
            </Grid>

            <Grid container item direction={"row"} alignItems={"center"}>
              <ProgressionGraph
                climbType={GYM_CLIMB_TYPES.Boulder}
                climbingData={climbingData}
                filter={boulderProgressionFilter}
              />
            </Grid>

            <SectionLegend section="progression" />
          </Grid>

          <Grid
            border={1}
            borderColor={ThemeColors.darkAccent}
            borderRadius={5}
            container
            direction={"column"}
            marginTop={2}
            padding={2}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"row"}
              display={"grid"}
              gridAutoRows={"auto"}
              gridTemplateColumns={"1fr 1fr 1fr"}
            >
              <Typography
                color={ThemeColors.darkShade}
                fontFamily={"poppins"}
                gridColumn={{ sm: "2", xs: "1" }}
                gutterBottom
                justifySelf={{ sm: "center", xs: "start" }}
                paddingLeft={{ sm: 0, xs: 2 }}
                variant="h6"
              >
                Lead
              </Typography>

              <Grid item gridColumn={"3"} justifySelf={"end"}>
                <SelectFilter
                  dashboardSection="progression"
                  selectedFilter={leadProgressionFilter}
                  setFilter={setLeadProgressionFilter}
                />
              </Grid>
            </Grid>

            <Grid container item direction={"row"} alignItems={"center"}>
              <ProgressionGraph
                climbType={GYM_CLIMB_TYPES.Lead}
                climbingData={climbingData}
                filter={leadProgressionFilter}
              />
            </Grid>

            <SectionLegend section="progression" />
          </Grid>

          <Grid
            border={1}
            borderColor={ThemeColors.darkAccent}
            borderRadius={5}
            container
            direction={"column"}
            marginBottom={5}
            marginTop={2}
            padding={2}
          >
            <Grid
              alignItems={"center"}
              container
              direction={"row"}
              display={"grid"}
              gridAutoRows={"auto"}
              gridTemplateColumns={"1fr 1fr 1fr"}
            >
              <Typography
                color={ThemeColors.darkShade}
                fontFamily={"poppins"}
                gridColumn={{ sm: "2", xs: "1" }}
                gutterBottom
                justifySelf={{ sm: "center", xs: "start" }}
                paddingLeft={{ sm: 0, xs: 2 }}
                variant="h6"
              >
                Top Rope
              </Typography>

              <Grid item gridColumn={"3"} justifySelf={"end"}>
                <SelectFilter
                  dashboardSection="progression"
                  selectedFilter={trProgressionFilter}
                  setFilter={setTrProgressionFilter}
                />
              </Grid>
            </Grid>

            <Grid container item direction={"row"} alignItems={"center"}>
              <ProgressionGraph
                climbType={GYM_CLIMB_TYPES.TopRope}
                climbingData={climbingData}
                filter={trProgressionFilter}
              />
            </Grid>

            <SectionLegend section="progression" />
          </Grid>
        </Grid>
      </Container>
      <AppFooter />
    </>
  )
}

export default ProgressionPage
