import moment, { Moment } from "moment"
import { ClimbLog } from "../../../../../static/types"
import { getMinimumMoment } from "../../../../../utils/data-helper-functions"
import { ClimbsByDate } from "../components/activity-graph"

interface ActivityGraphData {
  yAxisRange: number
  result: ClimbsByDate[]
}

export function filterRawClimbingData(
  data: ClimbLog[],
  range: string
): ActivityGraphData {
  const minMoment = getMinimumMoment(range)
  let result = setResultDates(minMoment.clone(), moment())
  let yAxisRange = 0

  data.forEach((climb) => {
    // check if the climb is within the date range first
    if (climb.unixTime < minMoment.unix()) {
      return
    }

    const date = moment
      .unix(climb.unixTime)
      .format("MMM DD, YYYY")
      .toString()

    const dateAlreadyAdded = result.find((r) => r.date === date)
    if (dateAlreadyAdded) {
      if (climb.tick === "Attempt") {
        dateAlreadyAdded.attempts += climb.count
      } else {
        dateAlreadyAdded.climbs += climb.count
      }

      // update the maxRange for the y-axis
      if (dateAlreadyAdded.climbs + dateAlreadyAdded.attempts > yAxisRange) {
        yAxisRange = dateAlreadyAdded.climbs + dateAlreadyAdded.attempts
      }
    }
  })

  return { yAxisRange: yAxisRange, result: result }
}

export function setResultDates(
  minMoment: Moment,
  maxMoment: Moment
): ClimbsByDate[] {
  let result: ClimbsByDate[] = []

  while (minMoment <= maxMoment) {
    result.push({
      climbs: 0,
      attempts: 0,
      date: minMoment.format("MMM DD, YYYY").toString(),
      timestamp: minMoment.unix(),
    })

    minMoment.add(1, "days")
  }

  return result
}
