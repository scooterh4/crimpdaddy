import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import React, { useMemo, useState } from "react"
import GradeSelector from "./grade-selector"
import {
  BOULDER_GRADES,
  CLIMB_TYPES,
  INDOOR_SPORT_GRADES,
  SessionClimb,
} from "../../../static/constants"
import moment from "moment"
import {
  useAddClimbTypeContext,
  useOpenAddClimbDialog,
  useSessionAPI,
} from "./session-logger-context"
import TickSelector from "./tick-selector"
import { ThemeColors } from "../../../static/styles"
import TickDescription from "./tick-description"
import AttemptInput from "./attempt-input"

export function LogClimbDialog() {
  const open = useOpenAddClimbDialog()
  const climbType = useAddClimbTypeContext()
  const { onClimbAdded, onCloseAddClimbDialog } = useSessionAPI()
  const [gradesList, setGradesList] = useState<string[]>([])
  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [selectedTick, setSelectedTick] = useState("")
  const [showAttemptInput, setAttemptInputVisibility] = useState(false)
  const [attemptCount, setAttemptCount] = useState<number | string>("")
  const [attemptError, setAttemptError] = useState(false)

  useMemo(() => {
    climbType === 0
      ? setGradesList(BOULDER_GRADES)
      : setGradesList(INDOOR_SPORT_GRADES)
  }, [climbType])

  function submitForm() {
    const climbData: SessionClimb = {
      ClimbType: CLIMB_TYPES[climbType],
      Grade: selectedGrade,
      Tick: selectedTick,
      AttemptCount:
        attemptCount.toString() === "" ? 1 : parseInt(attemptCount.toString()),
      UnixTime: moment().unix(),
    }

    console.log("ClimbData added:", climbData)
    onClimbAdded(climbType, climbData)
    resetDialog()
  }

  function resetDialog() {
    onCloseAddClimbDialog()
    setSelectedGrade("")
    setSelectedTick("")
    setAttemptCount("")
    setAttemptInputVisibility(false)
  }

  return (
    <Dialog open={open}>
      <DialogTitle fontFamily={"poppins"} fontWeight={"bold"}>
        Add {climbType > 0 ? "route" : "boulder"}
      </DialogTitle>
      <DialogContent>
        Select grade:
        <GradeSelector
          gradesList={gradesList}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
        />
        {selectedGrade !== "" && (
          <div>
            Select tick:
            <TickSelector
              selectedTick={selectedTick}
              setSelectedTick={setSelectedTick}
              setAttemptInputVisibility={setAttemptInputVisibility}
            />
          </div>
        )}
        {selectedTick !== "" && <TickDescription selectedTick={selectedTick} />}
        {showAttemptInput && (
          <AttemptInput
            attemptCount={attemptCount}
            setAttemptCount={setAttemptCount}
            attemptError={attemptError}
          />
        )}
      </DialogContent>
      <DialogActions>
        {selectedTick !== "" && (
          <Button
            onClick={submitForm}
            style={{
              backgroundColor: ThemeColors.darkAccent,
              color: "white",
            }}
          >
            Add
          </Button>
        )}
        <Button onClick={resetDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
