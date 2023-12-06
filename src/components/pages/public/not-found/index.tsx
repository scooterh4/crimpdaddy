import React from "react"
import { Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import HelpIcon from "@mui/icons-material/Help"
import { AppColors } from "../../../../static/styles"

export default function NotFound() {
  return (
    <Box
      alignItems={"center"}
      flexDirection={"column"}
      height={"85vh"}
      justifyContent={"center"}
      sx={{
        display: "flex",
      }}
    >
      <HelpIcon sx={{ color: AppColors.danger, fontSize: "40pt" }} />
      <Typography
        fontFamily={"poppins"}
        marginBottom={2}
        marginTop={2}
        paddingLeft={5}
        paddingRight={5}
        textAlign={"center"}
        variant="h4"
      >
        Hmmm... we couldn't find the page you're looking for.
      </Typography>
      <Link to={"/"} style={{ fontFamily: "poppins" }}>
        {"Return home"}
      </Link>
    </Box>
  )
}
