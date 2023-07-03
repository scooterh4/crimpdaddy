import React, { useContext, useEffect, useState } from "react"
import { GetClimbsByUser } from "../db/ClimbLogService"
import { UserContext } from "../Context"
import { ClimbLog } from "../static/types"
import { BarChart } from "@mui/x-charts/BarChart"
import { Grid } from "@mui/material"

const GradeGraph = () => {
  const { user } = useContext(UserContext)
  const [climbingData, setClimbingData] = useState<ClimbLog[]>([])
  const [gradeData, setGradeData] = useState<string[]>([])
  const [gradeAttemptMap, setGradeAttemptMap] = useState<Map<string, number>>(
    new Map<string, number>()
  )
  const [attemptDataArray, setAttemptDataArray] = useState<number[]>([])

  useEffect(() => {
    getClimbingData()
  }, [user])

  useEffect(() => {
    if (climbingData.length > 0) {
      createGraph()
    }
  }, [climbingData])

  function getClimbingData() {
    if (!user) return
    GetClimbsByUser(user.id).then((data) => {
      setClimbingData(data)
    })
  }

  function createGraph() {
    const newGradeData = new Array<string>()
    const newGradeAttemptMap = new Map<string, number>()
    const newAttemptDataArray: number[] = []

    climbingData.forEach((climb) => {
      newGradeData.push(climb.Grade)

      if (newGradeAttemptMap.has(climb.Grade)) {
        newGradeAttemptMap.set(
          climb.Grade,
          (newGradeAttemptMap.get(climb.Grade) || 0) + climb.Attempts
        )

        console.log("new map", newGradeAttemptMap.get(climb.Grade))
      } else {
        newGradeAttemptMap.set(climb.Grade, climb.Attempts)
      }
    })
    newGradeData.sort()
    newGradeData.forEach((grade) => {
      newAttemptDataArray.push(newGradeAttemptMap.get(grade) || 0)
    })

    setGradeData(newGradeData)
    setAttemptDataArray(newAttemptDataArray)
    // setGradeAttemptMap(newGradeAttemptMap)
  }

  return (
    <>
      <Grid
        container
        direction="column"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {gradeData.length > 0 && (
          <Grid container direction="row">
            <BarChart
              xAxis={[
                {
                  id: "barCategories",
                  data: gradeData,
                  scaleType: "band",
                },
              ]}
              series={[
                {
                  data: attemptDataArray,
                },
              ]}
              width={500}
              height={300}
            />
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
              {/* <p>Date: {climb.DateTime}</p> */}
            </div>
          ))}
        </Grid>
      </Grid>
    </>
  )
}

export default GradeGraph
