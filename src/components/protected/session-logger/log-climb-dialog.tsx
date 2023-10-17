import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import React, { useMemo, useState } from "react"
import GradeSelector from "./grade-selector"
import { ClimbLog } from "../../../static/types"
import {
  BOULDER_GRADES,
  GYM_CLIMB_TYPES,
  INDOOR_SPORT_GRADES,
} from "../../../static/constants"
import moment from "moment"
import {
  useAddClimbTypeContext,
  useOpenAddClimbDialog,
  useSessionAPI,
} from "./session-logger-context"

export function LogClimbDialog() {
  const open = useOpenAddClimbDialog()
  const climbType = useAddClimbTypeContext()
  const { onClimbAdded, onCloseAddClimbDialog } = useSessionAPI()
  const [gradesList, setGradesList] = useState<string[]>([])
  const [selectedGrade, setSelectedGrade] = useState<string>("")

  useMemo(() => {
    climbType === 0
      ? setGradesList(BOULDER_GRADES)
      : setGradesList(INDOOR_SPORT_GRADES)
  }, [climbType])

  function submitForm() {
    const climbData: ClimbLog = {
      ClimbType: GYM_CLIMB_TYPES[climbType],
      Grade: selectedGrade,
      Tick: "Redpoint (or something)",
      Count: 1,
      UnixTime: moment().unix(),
    }
    onClimbAdded(climbType, climbData)
    onCloseAddClimbDialog()
  }

  console.log("Log-climb-dialog render")

  return (
    <Dialog open={open}>
      <DialogTitle>Add {climbType > 0 ? "route" : "boulder"}</DialogTitle>
      <DialogContent>
        <GradeSelector
          gradesList={gradesList}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseAddClimbDialog}>Cancel</Button>
        <Button onClick={submitForm}>Add</Button>
      </DialogActions>
    </Dialog>
  )
}
