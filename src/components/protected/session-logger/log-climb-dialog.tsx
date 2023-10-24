import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material"
import React, { useMemo, useState } from "react"
import GradeSelector from "./grade-selector"
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
import TickSelector from "./tick-selector"
import { AppColors, ThemeColors } from "../../../static/styles"
import TickDescription from "./tick-description"
import AttemptInput from "./attempt-input"
import { SessionClimb } from "../../../static/types"
import RouteTypeSelector from "./route-type-selector"

export function LogClimbDialog() {
  const open = useOpenAddClimbDialog()
  const climbType = useAddClimbTypeContext()
  const { onClimbAdded, onCloseAddClimbDialog } = useSessionAPI()
  const [gradesList, setGradesList] = useState<string[]>([])
  const [routeClimbType, setRouteClimbType] = useState<string>("")
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

  function formHasError() {
    let hasError = false

    if (selectedTick !== "Onsight" && selectedTick !== "Flash") {
      if (!attemptCount || attemptCount === "") {
        setAttemptError(true)
        hasError = true
      }
    }

    return hasError
  }

  function submitForm() {
    if (!formHasError()) {
      const climbData: SessionClimb = {
        climbType: climbType > 0 ? routeClimbType : GYM_CLIMB_TYPES[climbType],
        grade: selectedGrade,
        tick: selectedTick,
        attemptCount:
          attemptCount.toString() === ""
            ? 1
            : parseInt(attemptCount.toString()),
        unixTime: moment().unix(),
      }

      console.log("ClimbData added:", climbData)
      onClimbAdded(climbType, climbData)
      resetDialog()
    } else {
      console.log("Form has error")
    }
  }

  function resetDialog() {
    onCloseAddClimbDialog()
    setRouteClimbType("")
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
        {climbType > GYM_CLIMB_TYPES.Boulder && (
          <RouteTypeSelector
            routeClimbType={routeClimbType}
            setRouteClimbType={setRouteClimbType}
          />
        )}
        {(climbType === GYM_CLIMB_TYPES.Boulder || routeClimbType) && (
          <div>
            <b>Select grade:</b>
            <GradeSelector
              gradesList={gradesList}
              selectedGrade={selectedGrade}
              setSelectedGrade={setSelectedGrade}
            />
          </div>
        )}
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
