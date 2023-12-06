import { Button, Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { ThemeColors } from "../../../../static/styles"
import SessionDisplay from "./components/session-display"
import {
  getUserClimbingSessions,
  getUserClimbingSessionsIds,
} from "../../../../utils/db"
import { useAuthContext } from "../../../app/context/auth-context"
import AppLoading from "../../../common/loading"
import {
  ClimbingSessionData,
  ClimbingSessionMetadata,
} from "../../../../static/types"

export default function SessionLogsPage() {
  const { user } = useAuthContext()
  const [loading, setLoading] = useState<boolean>(true)
  const [sessions, setSessions] = useState<ClimbingSessionMetadata[]>([])
  const [numSessionsToShow, setNumSessionsToShow] = useState<number>(3)
  const [sessionDataToShow, setSessionDataToShow] = useState<
    ClimbingSessionData[] | null
  >(null)

  useEffect(() => {
    if (user) {
      setLoading(true)
      getUserClimbingSessionsIds(user.id).then((result) => {
        setSessions(result)
        const sessionIds = result.map((r) => r.sessionId)

        if (result.length > 3) setNumSessionsToShow(3)
        else setNumSessionsToShow(result.length)

        getUserClimbingSessions(
          user.id,
          sessionIds.slice(0, result.length > 3 ? 3 : result.length)
        ).then((res) => {
          res.forEach((sesh) => {
            const metaData = result.find((r) => r.sessionId === sesh.sessionId)

            if (metaData) {
              const addSession: ClimbingSessionData = {
                sessionMetadata: metaData,
                climbs: sesh.climbs,
              }
              setSessionDataToShow((prev) =>
                prev ? [...prev, addSession] : [addSession]
              )
            }
          })
          setLoading(false)
        })
      })
    }
  }, [user])

  function loadMoreSessions() {
    if (user) {
      if (numSessionsToShow < sessions.length) {
        setLoading(true)
        setNumSessionsToShow(numSessionsToShow + 3)
        const sessionIds = sessions.map((ses) => ses.sessionId)
        const s = sessionIds.slice(
          numSessionsToShow,
          numSessionsToShow + 3 > sessionIds.length
            ? sessionIds.length
            : numSessionsToShow + 3
        )

        getUserClimbingSessions(user.id, s).then((res) => {
          res.forEach((sesh) => {
            const metaData = sessions.find(
              (s) => s.sessionId === sesh.sessionId
            )

            if (metaData) {
              const addSession: ClimbingSessionData = {
                sessionMetadata: metaData,
                climbs: sesh.climbs,
              }
              setSessionDataToShow((prev) =>
                prev ? [...prev, addSession] : [addSession]
              )
            }
          })
          setLoading(false)
        })
      }
    }
  }

  if (!loading && sessions.length === 0) {
    return (
      <>
        <Typography
          color={ThemeColors.darkShade}
          fontFamily={"poppins"}
          gutterBottom
          marginTop={2}
          variant="h3"
        >
          Sessions
        </Typography>
        <Typography>No sessions to display.</Typography>
      </>
    )
  }

  return (
    <>
      <Typography
        color={ThemeColors.darkShade}
        fontFamily={"poppins"}
        gutterBottom
        marginTop={2}
        variant="h3"
      >
        Sessions
      </Typography>

      {sessionDataToShow &&
        sessionDataToShow.map((session, index) => (
          <Grid
            container
            direction={"row"}
            key={index}
            marginTop={2}
            marginBottom={2}
          >
            <SessionDisplay data={session} />
          </Grid>
        ))}

      {loading && <AppLoading />}

      {sessions.length > numSessionsToShow && !loading && (
        <Grid container direction={"row"} justifyContent={"center"}>
          <Button
            onClick={loadMoreSessions}
            sx={{
              backgroundColor: ThemeColors.darkAccent,
              color: "white",
              fontFamily: "poppins",
              textTransform: "none",
            }}
          >
            Load more sessions
          </Button>
        </Grid>
      )}
    </>
  )
}
