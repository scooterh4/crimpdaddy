import React from "react"
import { useOutlet } from "react-router-dom"
import { UserDataProvider } from "../context/user-context"
import { Box, styled } from "@mui/material"
import AppToolbar from "../common/toolbar"
import AppFooter from "../common/footer"
import { ThemeColors, drawerWidth } from "../../static/styles"

const PageWrapper = styled("div")({
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: ThemeColors.backgroundColor,
  display: "flex",
})

export default function ProtectedLayout() {
  const outlet = useOutlet()

  return (
    <UserDataProvider>
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
            width: { lg: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
          }}
        >
          {outlet}
        </Box>

        <AppFooter isAuthenticated={true} />
      </PageWrapper>
    </UserDataProvider>
  )
}
