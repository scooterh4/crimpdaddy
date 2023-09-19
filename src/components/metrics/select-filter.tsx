import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useUserContext } from "../../context-api"
import { DateFilters, GradePyramidFilter } from "../../constants"

type SelectFilterProps = {
  page: string
  dateFilter: boolean
  selectedFilter: number
  setFilter: React.Dispatch<React.SetStateAction<number>>
}

type filterObj = {
  value: number
  label: string
}

function SelectFilter({
  page,
  dateFilter,
  selectedFilter,
  setFilter,
}: SelectFilterProps) {
  const { dataDateRange, updateDateRange } = useUserContext()
  const activityDateList = [
    { value: DateFilters.ThisWeek, label: "This week" },
    { value: DateFilters.ThisMonth, label: "This month" },
    { value: DateFilters.LastMonth, label: "Last month" },
  ]
  const otherDateList = [
    { value: DateFilters.Last6Months, label: "Last 6 months" },
    { value: DateFilters.Last12Months, label: "Last 12 months" },
  ]
  const gradePyramidSelectList = [
    { value: GradePyramidFilter.ClimbsAndAttempts, label: "Attempts & Climbs" },
    { value: GradePyramidFilter.AttemptsOnly, label: "Attempts only" },
    { value: GradePyramidFilter.ClimbsOnly, label: "Climbs only" },
  ]

  const [selectList, setSelectList] = useState<filterObj[]>(
    page === "activity"
      ? activityDateList
      : dateFilter
      ? otherDateList
      : gradePyramidSelectList
  )

  useEffect(() => {
    if (!dateFilter) {
      setSelectList(gradePyramidSelectList)
    } else {
      switch (page) {
        case "activity":
          setSelectList(activityDateList)
          break
        case "gradePyramids":
          setSelectList(otherDateList)
          break
        case "progression":
          setSelectList(otherDateList)
          break
      }
    }
  }, [])

  const handleFilterChange = (event: SelectChangeEvent) => {
    const value = parseInt(event.target.value)
    if (dateFilter) {
      // the graph needs data that's farther back in time than the data available
      if (!dataDateRange || value > dataDateRange) {
        updateDateRange(value)
      }
    }
    setFilter(value)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120, background: "white" }}>
      <Select
        defaultValue={selectedFilter.toString()}
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

export default SelectFilter
