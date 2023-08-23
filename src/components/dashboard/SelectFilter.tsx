import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import React, { useEffect, useState } from "react"

export type SelectFilterProps = {
  dashboardSection: string
  selectedFilter: string
  setFilter: React.Dispatch<React.SetStateAction<string>>
}

export type filterObj = {
  value: string
  label: string
}

function SelectFilter({
  dashboardSection,
  selectedFilter,
  setFilter,
}: SelectFilterProps) {
  const activityList = [
    { value: "thisWeek", label: "This week" },
    { value: "thisMonth", label: "This month" },
    { value: "lastMonth", label: "Last month" },
  ]
  const otherList = [
    { value: "last6Months", label: "Last 6 months" },
    { value: "last12Months", label: "Last 12 months" },
  ]

  const [selectList, setSelectList] = useState<filterObj[]>(
    dashboardSection === "activity" ? activityList : otherList
  )

  useEffect(() => {
    switch (selectedFilter) {
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
  }, [selectedFilter])

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120, background: "white" }}>
      <Select
        defaultValue={selectedFilter}
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
