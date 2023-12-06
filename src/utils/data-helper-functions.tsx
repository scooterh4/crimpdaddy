import moment from "moment"
import { DateFilters } from "../static/constants"

export function getMinimumMoment(dateFilter: string) {
  let minMoment = moment()

  switch (dateFilter) {
    case DateFilters.ThisWeek:
      minMoment = moment().subtract(6, "days")
      break

    case DateFilters.ThisMonth:
      minMoment = moment().subtract(1, "months")
      break

    case DateFilters.Last3Months:
      minMoment = moment().subtract(3, "months")
      break

    case DateFilters.Last6Months:
      minMoment = moment().subtract(6, "months")
      break

    case DateFilters.Last12Months:
      minMoment = moment().subtract(12, "months")
      break
  }

  return minMoment
}
