import React, { useEffect, useState } from "react"
import { ClimbLog, ClimbGraphData, TickTypes } from "../static/types"
import { Card, Grid, Typography } from "@mui/material"
import GradeGraph from "./GradeGraph"
import { INDOOR_SPORT_GRADES } from "../static/constants"
import GradePyramidsLegend from "./GradePyramidsLegend"

export type GradeGraphWrapperProps = {
  climbingData: ClimbLog[]
}

function GradeGraphWrapper({ climbingData }: GradeGraphWrapperProps) {
  const [graphData, setGraphData] = useState({
    boulderData: [] as ClimbGraphData[],
    leadData: [] as ClimbGraphData[],
    trData: [] as ClimbGraphData[],
  })

  useEffect(() => {
    if (climbingData.length > 0) {
      const formattedData = formatClimbingData()
      setGraphData(formattedData)
    }
  }, [climbingData])

  function formatClimbingData() {
    const boulderGradeAttemptMap = new Map<string, TickTypes>()
    const leadGradeAttemptMap = new Map<string, TickTypes>()
    const trGradeAttemptMap = new Map<string, TickTypes>()

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

  function addGradeData(
    climb: ClimbLog,
    gradeAttemptMap: Map<string, TickTypes>
  ) {
    const ticks = gradeAttemptMap.get(climb.Grade) || {
      Onsight: 0,
      Flash: 0,
      Redpoint: 0,
      Attempts: 0,
    }

    switch (climb.Tick) {
      case "Onsight":
        ticks.Onsight += 1
        break
      case "Flash":
        ticks.Flash += 1
        break
      case "Redpoint":
        ticks.Redpoint += 1
        break
      default:
        break
    }

    ticks.Attempts += climb.Attempts > 1 ? climb.Attempts - 1 : 0
    gradeAttemptMap.set(climb.Grade, ticks)
  }

  function assembleGraphData(
    gradesArray: string[],
    gradeAttemptMap: Map<string, TickTypes>
  ): ClimbGraphData[] {
    const graphData: ClimbGraphData[] = []

    gradesArray.forEach((grade) => {
      const ticks: TickTypes = gradeAttemptMap.get(grade) || {
        Onsight: 0,
        Flash: 0,
        Redpoint: 0,
        Attempts: 0,
      }

      graphData.push({
        Grade: grade,
        Onsight: ticks.Onsight,
        Flash: ticks.Flash,
        Redpoint: ticks.Redpoint,
        Attempts: ticks.Attempts,
      })
    })

    return graphData
  }

  return (
    <>
      {climbingData.length > 0 && (
        <>
          <Card sx={{ borderRadius: 5 }}>
            <Typography variant="h5" align="center">
              Grade Pyramids
            </Typography>

            <Grid
              container
              direction={"row"}
              justifyContent={"center"}
              sx={{ display: "flex" }}
            >
              <GradePyramidsLegend />
            </Grid>

            <Grid
              item
              container
              direction={"column"}
              sm={4}
              xs={12}
              padding={2}
              sx={{ display: "inline-block" }}
            >
              <Typography variant="h6" align="center">
                Bouldering
              </Typography>
              <GradeGraph
                climbType="Boulder"
                graphData={graphData.boulderData}
              />
            </Grid>

            <Grid
              item
              container
              direction={"column"}
              sm={4}
              xs={12}
              padding={2}
              sx={{ display: "inline-block" }}
            >
              <Typography variant="h6" align="center">
                Lead
              </Typography>
              <GradeGraph climbType="Lead" graphData={graphData.leadData} />
            </Grid>

            <Grid
              item
              container
              direction={"column"}
              sm={4}
              xs={12}
              padding={2}
              sx={{ display: "inline-block" }}
            >
              <Typography variant="h6" align="center">
                Top Rope
              </Typography>
              <GradeGraph climbType="Top Rope" graphData={graphData.trData} />
            </Grid>
          </Card>
        </>
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
            <p>Date: {climb.DateTime.toDateString()}</p>
          </div>
        ))}
      </Grid> */}
    </>
  )
}

export default GradeGraphWrapper
