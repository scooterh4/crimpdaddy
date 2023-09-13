import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import React, { useEffect, useState } from "react"
import { DateFilters } from "../../db/ClimbLogService"

export type SelectFilterProps = {
  dashboardSection: string
  selectedFilter: number
  setFilter: React.Dispatch<React.SetStateAction<number>>
}

export type filterObj = {
  value: number
  label: string
}

function SelectFilter({
  dashboardSection,
  selectedFilter,
  setFilter,
}: SelectFilterProps) {
  const activityList = [
    { value: DateFilters.ThisWeek, label: "This week" },
    { value: DateFilters.ThisMonth, label: "This month" },
    { value: DateFilters.LastMonth, label: "Last month" },
  ]
  const otherList = [
    { value: DateFilters.Last6Months, label: "Last 6 months" },
    { value: DateFilters.Last12Months, label: "Last 12 months" },
  ]

  const [selectList, setSelectList] = useState<filterObj[]>(
    dashboardSection === "activity" ? activityList : otherList
  )

  useEffect(() => {
    switch (dashboardSection) {
      case "activity":
        setSelectList(activityList)
        break
      case "gradePyramids":
        setSelectList(otherList)
        break
      case "progression":
        setSelectList(otherList)
        break
    }
  }, [])

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(parseInt(event.target.value))
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
