import React from "react"
import { Box } from "@mui/material"
import AppFooter from "../../../common/footer"
import HeroDisplay from "./components/hero-display"
import AppBenefitsDisplay from "./components/app-benefits-display"
import SignUpDisplay from "./components/sign-up-display"
import HowToUseAppDisplay from "./components/how-to-use-app-display"

export default function Landing() {
  return (
    <Box
      flexDirection={"column"}
      sx={{
        display: "flex",
      }}
    >
      <HeroDisplay />
      <AppBenefitsDisplay />
      <HowToUseAppDisplay />
      <SignUpDisplay />
      <AppFooter isAuthenticated={false} />
    </Box>
  )
}
