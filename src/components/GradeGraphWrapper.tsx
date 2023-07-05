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
      formatClimbingData()
    }
  }, [climbingData])

  function getClimbingData() {
    if (!user) return
    GetClimbsByUser(user.id).then((data) => {
      setClimbingData(data)
    })
  }

  function formatClimbingData() {
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
          addGradeData(climb, boulderGradeAttemptMap, boulderGrades)
          break

        case "Lead":
          addGradeData(climb, leadGradeAttemptMap, leadGrades)
          break

        case "TopRope":
          addGradeData(climb, trGradeAttemptMap, trGrades)
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

    asssembleGraphData(boulderGrades, boulderGradeAttemptMap, boulderGraphData)
    asssembleGraphData(leadGrades, leadGradeAttemptMap, leadGraphData)
    asssembleGraphData(trGrades, trGradeAttemptMap, trGraphData)

    setBoulderData(boulderGraphData)
    setLeadData(leadGraphData)
    setTrData(trGraphData)
  }

  // Helper functions
  function addGradeData(
    climb: ClimbLog,
    gradeAttemptMap: Map<string, number>,
    gradeArray: Array<string>
  ) {
    if (gradeAttemptMap.has(climb.Grade)) {
      gradeAttemptMap.set(
        climb.Grade,
        (gradeAttemptMap.get(climb.Grade) || 0) + climb.Attempts
      )
    } else {
      gradeArray.push(climb.Grade)
      gradeAttemptMap.set(climb.Grade, climb.Attempts)
    }
  }

  function asssembleGraphData(
    gradesArray: Array<string>,
    gradeAttemptMap: Map<string, number>,
    graphData: Array<ClimbGraphData>
  ) {
    gradesArray.forEach((gr) => {
      graphData.push({
        Grade: gr,
        Attempts: gradeAttemptMap.get(gr) || 0,
        Flash: 1,
      })
    })
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
      <Grid
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
            {/* <p>Date: {climb.DateTime.toDateString()}</p> */}
          </div>
        ))}
      </Grid>
    </>
  )
}

export default GradeGraphWrapper
