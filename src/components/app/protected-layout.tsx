import React, { useEffect } from "react"
import { Navigate, useOutlet } from "react-router-dom"
import { auth } from "../../firebase"
import { Unsubscribe, onAuthStateChanged } from "firebase/auth"
import { useUserContext } from "../context/user-context"
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
  const isAuthenticated = !!sessionStorage.getItem("Auth Token")
  const { user, updateUser } = useUserContext()
  const outlet = useOutlet()

  // user refreshed the page
  useEffect(() => {
    const subscriber: Unsubscribe = onAuthStateChanged(
      auth,
      (persistedUser) => {
        if (persistedUser && !user) {
          updateUser({
            id: persistedUser.uid,
            email: persistedUser.email ? persistedUser.email : "",
          })
          return (
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
          )
        }
      }
    )

    // Unsubscribe the listener when the component is unmounted
    return () => subscriber()
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // Normal sign in case
  return (
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
  )
}
