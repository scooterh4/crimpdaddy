import React, { useContext, useEffect, useState } from "react"
import { GetClimbsByUser } from "../db/ClimbLogService"
import { UserContext } from "../Context"
import { ClimbLog, ClimbGraphData } from "../static/types"
import { Grid } from "@mui/material"
import GradeGraph from "./GradeGraph"
import { INDOOR_SPORT_GRADES } from "../static/constants"

const GradeGraphWrapper = () => {
  const { user } = useContext(UserContext)
  const [climbingData, setClimbingData] = useState<ClimbLog[]>([])
  const [graphData, setGraphData] = useState({
    boulderData: [] as ClimbGraphData[],
    leadData: [] as ClimbGraphData[],
    trData: [] as ClimbGraphData[],
  })

  useEffect(() => {
    if (user) {
      GetClimbsByUser(user.id).then((data) => {
        setClimbingData(data)
      })
    }
  }, [user])

  useEffect(() => {
    if (climbingData.length > 0) {
      const formattedData = formatClimbingData()
      setGraphData(formattedData)
    }
  }, [climbingData])

  function formatClimbingData() {
    const boulderGradeAttemptMap = new Map<string, number>()
    const leadGradeAttemptMap = new Map<string, number>()
    const trGradeAttemptMap = new Map<string, number>()

    climbingData.forEach((climb) => {
      const gradeAttemptMap =
        climb.ClimbType === "Boulder"
          ? boulderGradeAttemptMap
          : climb.ClimbType === "Lead"
          ? leadGradeAttemptMap
          : trGradeAttemptMap

      addGradeData(climb, gradeAttemptMap)
    })

    // Get sorted lists of the grades in descending order
    const boulderGrades = Array.from(
      boulderGradeAttemptMap.keys()
    ).sort((a, b) => b.localeCompare(a))

    const leadGrades = Array.from(leadGradeAttemptMap.keys())
      .sort(
        (a, b) =>
          INDOOR_SPORT_GRADES.indexOf(a) - INDOOR_SPORT_GRADES.indexOf(b)
      )
      .reverse()

    const trGrades = Array.from(trGradeAttemptMap.keys())
      .sort(
        (a, b) =>
          INDOOR_SPORT_GRADES.indexOf(a) - INDOOR_SPORT_GRADES.indexOf(b)
      )
      .reverse()

    // Assemble the data for each graph
    const boulderGraphData = assembleGraphData(
      boulderGrades,
      boulderGradeAttemptMap
    )
    const leadGraphData = assembleGraphData(leadGrades, leadGradeAttemptMap)
    const trGraphData = assembleGraphData(trGrades, trGradeAttemptMap)

    return {
      boulderData: boulderGraphData,
      leadData: leadGraphData,
      trData: trGraphData,
    }
  }

  function addGradeData(climb: ClimbLog, gradeAttemptMap: Map<string, number>) {
    const attempts = gradeAttemptMap.get(climb.Grade) || 0
    gradeAttemptMap.set(climb.Grade, attempts + climb.Attempts)
  }

  function assembleGraphData(
    gradesArray: string[],
    gradeAttemptMap: Map<string, number>
  ): ClimbGraphData[] {
    return gradesArray.map((grade) => ({
      Grade: grade,
      Attempts: gradeAttemptMap.get(grade) || 0,
      Flash: 1,
    }))
  }

  return (
    <>
      {climbingData.length > 0 && (
        <Grid container direction="row" sx={{ mt: 5 }}>
          <GradeGraph climbType="Boulder" graphData={graphData.boulderData} />
          <GradeGraph climbType="Lead" graphData={graphData.leadData} />
          <GradeGraph climbType="Top Rope" graphData={graphData.trData} />
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
