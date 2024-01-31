import React from "react"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@mui/material"
import { AppColors, AppFont, ThemeColors } from "../../../../../static/styles"
import LooksOneIcon from "@mui/icons-material/LooksOne"
import LooksTwoIcon from "@mui/icons-material/LooksTwo"
import LooksThreeIcon from "@mui/icons-material/Looks3"
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import AddIcon from "@mui/icons-material/Add"
import AddClimbsGif from "../../../../../images/add_climbs.gif"
import StartSessionGif from "../../../../../images/start_session.gif"
import LogSessionGif from "../../../../../images/log_Session.gif"

type UsageInfo = {
  icon: ReactJSXElement
  body: string
  gif: string
}

const usageSteps: UsageInfo[] = [
  {
    icon: <LooksOneIcon fontSize="large" sx={{ color: "white" }} />,
    body: "When you get to the gym, login and start a new session.",
    gif: StartSessionGif,
  },
  {
    icon: <LooksTwoIcon fontSize="large" sx={{ color: "white" }} />,
    body: "Log your climbs as you go.",
    gif: AddClimbsGif,
  },
  {
    icon: <LooksThreeIcon fontSize="large" sx={{ color: "white" }} />,
    body: "When you're done, log the session and view your progress!",
    gif: LogSessionGif,
  },
]

export default function HowToUseAppDisplay() {
  return (
    <Grid
      flexDirection="row"
      display={"grid"}
      justifyContent={"center"}
      paddingBottom={10}
      paddingTop={10}
      sx={{ backgroundColor: ThemeColors.darkShade }}
    >
      <Typography variant="h3" color={"white"} textAlign={"center"}>
        Use in 3 easy steps:
      </Typography>

      <Grid container direction="row">
        {usageSteps.map((item, index) => (
          <Grid
            key={index}
            item
            lg={4}
            xs={12}
            container
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            padding={2}
            minHeight={"400px"}
          >
            <Grid
              container
              direction="column"
              alignItems={"center"}
              display="flex"
              marginTop={5}
              width={{ lg: "25vw", md: "40vw", xs: "90%" }}
              padding={2}
              border={1}
              borderRadius={5}
              borderColor={"white"}
            >
              {item.icon}
              <Typography
                fontFamily={AppFont}
                variant="h6"
                color={AppColors.primary}
                marginBottom={2}
                marginTop={1}
                textAlign={"center"}
              >
                {item.body}
              </Typography>

              <Accordion sx={{ backgroundColor: ThemeColors.darkShade }}>
                <AccordionSummary
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <AddIcon fontSize="large" sx={{ color: "white" }} />
                </AccordionSummary>
                <AccordionDetails>
                  <img src={item.gif} style={{ borderRadius: 5 }} />
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}
