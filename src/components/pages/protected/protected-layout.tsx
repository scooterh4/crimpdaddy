import React from "react"
import { useLocation, useOutlet } from "react-router-dom"
import { ProtectedDataProvider } from "./context/protected-context"
import { Box, styled, useMediaQuery } from "@mui/material"
import AppToolbar from "../../common/toolbar"
import AppFooter from "../../common/footer"
import { ThemeColors, drawerWidth } from "../../../static/styles"
import { Routes } from "../../../router"
import { useTheme } from "@mui/material"

const PageWrapper = styled("div")({
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: ThemeColors.backgroundColor,
  display: "flex",
})

export default function ProtectedLayout() {
  const outlet = useOutlet()
  const location = useLocation()
  const theme = useTheme()
  const lgScreenAndUp = useMediaQuery(theme.breakpoints.up("lg"))

  const contentWidth =
    location.pathname !== Routes.climbSession
      ? lgScreenAndUp
        ? `calc(100% - ${drawerWidth}px)`
        : "100%"
      : "100%"

  return (
    <ProtectedDataProvider>
      <PageWrapper>
        <AppToolbar title="Dashboard" />

        <Box
          alignSelf={{ lg: "end", xs: "center" }}
          component="main"
          marginTop={5}
          minHeight={"87vh"}
          sx={{
            flexGrow: 1,
            p: 3,
            width: contentWidth,
          }}
        >
          {outlet}
        </Box>

        <AppFooter isAuthenticated={true} />
      </PageWrapper>
    </ProtectedDataProvider>
  )
}
