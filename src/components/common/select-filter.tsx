import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useUserContext } from "../context/user-context"
import { DateFilters, GradePyramidFilter } from "../../static/constants"

type Props = {
  graph: string
  dateFilter: boolean
  setFilter: React.Dispatch<React.SetStateAction<number>>
}

type filterObj = {
  value: number
  label: string
}

export default function SelectFilter({ graph, dateFilter, setFilter }: Props) {
  const { dataDateRange, updateDateRange } = useUserContext()

  const activityDateList = [
    { value: DateFilters.ThisWeek, label: "Last week" },
    { value: DateFilters.ThisMonth, label: "Last month" },
  ]
  const otherDateList = [
    { value: DateFilters.Last6Months, label: "Last 6 months" },
    { value: DateFilters.Last12Months, label: "Last 12 months" },
  ]
  const gradePyramidSelectList = [
    { value: GradePyramidFilter.ClimbsOnly, label: "Climbs only" },
    { value: GradePyramidFilter.AttemptsOnly, label: "Attempts only" },
    { value: GradePyramidFilter.ClimbsAndAttempts, label: "Attempts & Climbs" },
  ]

  const [selectList, setSelectList] = useState<filterObj[]>(
    graph === "activity"
      ? activityDateList
      : dateFilter
      ? otherDateList
      : gradePyramidSelectList
  )

  useEffect(() => {
    if (!dateFilter) {
      setSelectList(gradePyramidSelectList)
    } else {
      switch (graph) {
        case "activity":
          setSelectList(activityDateList)
          break
        default:
          setSelectList(otherDateList)
          break
      }
    }
  }, [])

  const handleFilterChange = (event: SelectChangeEvent) => {
    const value = parseInt(event.target.value)
    if (value !== undefined && value !== null) {
      if (dateFilter) {
        // the graph needs data that's farther back in time than the data available
        if (!dataDateRange || value > dataDateRange) {
          updateDateRange(value, graph)
        }
      }
      setFilter(value)
    }
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120, background: "white" }}>
      <Select
        defaultValue={
          dateFilter
            ? graph === "activity"
              ? DateFilters.ThisWeek.toString()
              : DateFilters.Last6Months.toString()
            : GradePyramidFilter.ClimbsOnly.toString()
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
