import moment, { Moment } from "moment"
import { DateFilters } from "../../../../../static/constants"
import { ClimbLog, ProgressionGraphData } from "../../../../../static/types"

function getProgressionGraphDataAndXAxis(startMoment: Moment) {
  let graphData: ProgressionGraphData[] = []
  let xAxis: string[] = []
  let month = 0
  let now = moment()

  while (startMoment.month() < now.month() || startMoment.year() < now.year()) {
    console.log("getProgressionGraphDataAndXAxis loop")

    const monthToAdd = startMoment.format("MMM YYYY").toString()
    xAxis.push(monthToAdd)

    graphData.push({
      month: monthToAdd,
      monthIdx: month,
      hardestClimbIdx: 0,
      hardestAttemptIdx: 0,
      progressionLine: 0,
    } as ProgressionGraphData)

    startMoment = startMoment.add(1, "month")
    if (startMoment.month() === 0) {
      startMoment.add(1, "year")
    }
    month++
  }

  // when it's December
  if (now.month() === 11) {
    const dec = now.format("MMM YYYY").toString()
    xAxis.push(dec)

    graphData.push({
      month: dec,
      monthIdx: month,
      hardestClimbIdx: 0,
      hardestAttemptIdx: 0,
      progressionLine: 0,
    } as ProgressionGraphData)
  }

  return { graphData: graphData, xAxis: xAxis }
}

export async function formatDataForProgressionGraph(
  climbingData: ClimbLog[],
  filter: string,
  gradeSystem: string[]
) {
  console.log("formatDataForProgressionGraph start")
  const startTime =
    filter === DateFilters.Last6Months
      ? moment().subtract(5, "months")
      : moment().subtract(11, "months")

  const { graphData, xAxis } = getProgressionGraphDataAndXAxis(startTime)
  let gradeMaxIndex = 0 // for the y-axis range

  climbingData.forEach((climb) => {
    // All climbs should be in the correct date range
    const month = moment
      .unix(climb.unixTime)
      .format("MMM YYYY")
      .toString()

    const climbMonthAdded = graphData.find((r) => r.month === month)

    if (climbMonthAdded) {
      const climbIdx = gradeSystem.indexOf(climb.grade)
      if (climb.tick !== "Attempt") {
        if (climbMonthAdded.hardestClimbIdx > climbIdx) {
          return
        } else {
          climbMonthAdded.hardestClimbIdx = climbIdx
          climbMonthAdded.progressionLine = climbIdx
        }
      } else {
        if (climbMonthAdded.hardestAttemptIdx > climbIdx) {
          return
        } else {
          climbMonthAdded.hardestAttemptIdx = climbIdx
        }
      }

      // update the grade index for the y-axis range
      gradeMaxIndex = gradeMaxIndex < climbIdx ? climbIdx : gradeMaxIndex
    }
  })

  const firstBarIdx = graphData.findIndex((x) => x.progressionLine)

  graphData.forEach((obj, index) => {
    // calculate the hardestAttempts as the difference between hardestAttemptIdx and hardestClimbIdx

    const attemptValue = Math.max(
      0,
      obj.hardestAttemptIdx - obj.hardestClimbIdx
    )
    obj.hardestAttemptIdx = attemptValue

    // handle empty values after a bar
    if (
      index > 0 &&
      graphData[index - 1].hardestClimbIdx > obj.hardestClimbIdx
    ) {
      obj.progressionLine = graphData[index - 1].hardestClimbIdx
    } else if (index < graphData.length - 1) {
      // handle empty values before a bar
      if (
        graphData[index + 1].hardestClimbIdx > obj.hardestClimbIdx &&
        index > firstBarIdx
      ) {
        obj.progressionLine = graphData[index + 1].hardestClimbIdx
      }
    }
  })

  return {
    gradeRange: [0, gradeMaxIndex + 2],
    graphData: graphData,
    xAxis: xAxis,
  }
}
