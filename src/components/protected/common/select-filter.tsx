import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import React, { useEffect, useState } from "react"
import {
  DateFilters,
  GradePyramidFilter,
  PromiseTrackerArea,
} from "../../../static/constants"

type Props = {
  graph: string
  dateFilter: boolean
  setFilter: React.Dispatch<React.SetStateAction<string>>
}

type filterObj = {
  value: string
  label: string
}

export default function SelectFilter({ graph, dateFilter, setFilter }: Props) {
  const activityDateList = [
    { value: DateFilters.ThisWeek, label: "Last week" },
    { value: DateFilters.ThisMonth, label: "Last month" },
  ]
  const gradePyramidDateList = [
    { value: DateFilters.ThisMonth, label: "Last month" },
    { value: DateFilters.Last3Months, label: "Last 3 months" },
    { value: DateFilters.Last6Months, label: "Last 6 months" },
    { value: DateFilters.Last12Months, label: "Last 12 months" },
  ]
  const progressionDateList = [
    { value: DateFilters.Last6Months, label: "Last 6 months" },
    { value: DateFilters.Last12Months, label: "Last 12 months" },
  ]
  const gradePyramidSelectList = [
    { value: GradePyramidFilter.ClimbsOnly, label: "Climbs only" },
    { value: GradePyramidFilter.AttemptsOnly, label: "Attempts only" },
    { value: GradePyramidFilter.ClimbsAndAttempts, label: "Attempts & Climbs" },
  ]
  const sessionGradePyramidSelectList = [
    { value: GradePyramidFilter.AllRoutes, label: "All routes" },
    { value: GradePyramidFilter.LeadOnly, label: "Lead" },
    { value: GradePyramidFilter.TrOnly, label: "Top rope" },
  ]

  const [selectList, setSelectList] = useState<filterObj[]>(
    dateFilter
      ? graph === PromiseTrackerArea.Activity
        ? activityDateList
        : graph === PromiseTrackerArea.ProgressionGraph
        ? progressionDateList
        : gradePyramidDateList
      : graph === PromiseTrackerArea.GradePyramidGraph
      ? gradePyramidSelectList
      : sessionGradePyramidSelectList
  )

  useEffect(() => {
    if (!dateFilter) {
      graph === PromiseTrackerArea.GradePyramidGraph
        ? setSelectList(gradePyramidSelectList)
        : setSelectList(sessionGradePyramidSelectList)
    } else {
      switch (graph) {
        case PromiseTrackerArea.Activity:
          setSelectList(activityDateList)
          break

        case PromiseTrackerArea.ProgressionGraph:
          setSelectList(progressionDateList)
          break

        case PromiseTrackerArea.GradePyramidGraph:
          setSelectList(gradePyramidDateList)
          break
      }
    }
  }, [])

  const handleFilterChange = (event: SelectChangeEvent) => {
    const value = event.target.value.toString()
    if (value !== undefined && value !== null) {
      setFilter(value)
    }
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120, background: "white" }}>
      <Select
        defaultValue={
          dateFilter
            ? graph === PromiseTrackerArea.Activity
              ? DateFilters.ThisWeek.toString()
              : graph === PromiseTrackerArea.GradePyramidGraph
              ? DateFilters.ThisMonth.toString()
              : DateFilters.Last6Months.toString()
            : graph === PromiseTrackerArea.GradePyramidGraph
            ? GradePyramidFilter.ClimbsOnly.toString()
            : GradePyramidFilter.AllRoutes.toString()
        }
        onChange={handleFilterChange}
        sx={{ fontFamily: "poppins" }}
      >
        {selectList.map((select) => (
          <MenuItem
            key={select.value}
            value={select.value}
            sx={{ fontFamily: "poppins" }}
          >
            {select.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
