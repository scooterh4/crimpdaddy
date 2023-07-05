import React, { useContext, useEffect, useState } from "react"
import { GetClimbsByUser } from "../db/ClimbLogService"
import { UserContext } from "../Context"
import { ClimbLog, ClimbGraphData } from "../static/types"
import { Grid } from "@mui/material"
import GradeGraph from "./GradeGraph"
import { ResponsiveContainer } from "recharts"

const GradeGraphWrapper = () => {
  const { user } = useContext(UserContext)
  const [climbingData, setClimbingData] = useState<ClimbLog[]>([])

  const [boulderData, setBoulderData] = useState<ClimbGraphData[]>([])
  const [leadData, setLeadData] = useState<ClimbGraphData[]>([])
  const [trData, setTrData] = useState<ClimbGraphData[]>([])

  useEffect(() => {
    getClimbingData()
  }, [user])

  useEffect(() => {
    if (climbingData.length > 0) {
      assembleGraphData()
    }
  }, [climbingData])

  function getClimbingData() {
    if (!user) return
    GetClimbsByUser(user.id).then((data) => {
      setClimbingData(data)
    })
  }

  function assembleGraphData() {
    const boulderGrades = new Array<string>()
    const boulderGradeAttemptMap = new Map<string, number>()
    const boulderGraphData = new Array<ClimbGraphData>()

    const leadGrades = new Array<string>()
    const leadGradeAttemptMap = new Map<string, number>()
    const leadGraphData = new Array<ClimbGraphData>()

    const trGrades = new Array<string>()
    const trGradeAttemptMap = new Map<string, number>()
    const trGraphData = new Array<ClimbGraphData>()

    // The raw data returned from firebase is a giant list of climbs
    // Go through that list and sort the data into the appropriate buckets
    climbingData.forEach((climb) => {
      switch (climb.ClimbType) {
        case "Boulder":
          if (boulderGradeAttemptMap.has(climb.Grade)) {
            boulderGradeAttemptMap.set(
              climb.Grade,
              (boulderGradeAttemptMap.get(climb.Grade) || 0) + climb.Attempts
            )
          } else {
            boulderGrades.push(climb.Grade)
            boulderGradeAttemptMap.set(climb.Grade, climb.Attempts)
          }
          break

        case "Lead":
          if (leadGradeAttemptMap.has(climb.Grade)) {
            leadGradeAttemptMap.set(
              climb.Grade,
              (leadGradeAttemptMap.get(climb.Grade) || 0) + climb.Attempts
            )
          } else {
            leadGrades.push(climb.Grade)
            leadGradeAttemptMap.set(climb.Grade, climb.Attempts)
          }
          break

        case "TopRope":
          if (trGradeAttemptMap.has(climb.Grade)) {
            trGradeAttemptMap.set(
              climb.Grade,
              (trGradeAttemptMap.get(climb.Grade) || 0) + climb.Attempts
            )
          } else {
            trGrades.push(climb.Grade)
            trGradeAttemptMap.set(climb.Grade, climb.Attempts)
          }
          break

        default:
          break
      }
    })

    // sort grades in descending order
    boulderGrades.sort((a, b) => {
      if (a > b) return -1
      if (a < b) return 1
      return 0
    })
    leadGrades.sort((a, b) => {
      if (a > b) return -1
      if (a < b) return 1
      return 0
    })
    trGrades.sort((a, b) => {
      if (a > b) return -1
      if (a < b) return 1
      return 0
    })

    boulderGrades.forEach((gr) => {
      boulderGraphData.push({
        Grade: gr,
        Attempts: boulderGradeAttemptMap.get(gr) || 0,
        Flash: 1,
      })
    })
    leadGrades.forEach((gr) => {
      leadGraphData.push({
        Grade: gr,
        Attempts: leadGradeAttemptMap.get(gr) || 0,
        Flash: 1,
      })
    })
    trGrades.forEach((gr) => {
      trGraphData.push({
        Grade: gr,
        Attempts: trGradeAttemptMap.get(gr) || 0,
        Flash: 1,
      })
    })

    setBoulderData(boulderGraphData)
    setLeadData(leadGraphData)
    setTrData(trGraphData)
  }

  return (
    <>
      {climbingData.length > 0 && (
        <Grid container direction="row" sx={{ mt: 5 }}>
          <GradeGraph climbType="Boulder" graphData={boulderData} />
          <GradeGraph climbType="Lead" graphData={leadData} />
          <GradeGraph climbType="Top Rope" graphData={trData} />
        </Grid>
      )}
      {/* <Grid
          container
          direction="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {climbingData.map((climb) => (
            <div key={Math.random()} style={{ margin: 2 }}>
              <p>Climb Type: {climb.ClimbType}</p>
              <p>Grade: {climb.Grade}</p>
              <p>Attempts: {climb.Attempts}</p>
              <p>Tick: {climb.Tick}</p>
              <p>Date: {climb.DateTime}</p>
            </div>
          ))}
        </Grid> */}
    </>
  )
}

export default GradeGraphWrapper
