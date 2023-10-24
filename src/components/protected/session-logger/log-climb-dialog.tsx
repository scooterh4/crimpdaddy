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
  GYM_CLIMB_TYPES,
  INDOOR_SPORT_GRADES,
} from "../../../static/constants"
import moment from "moment"
import {
  useAddClimbTypeContext,
  useEditClimbContext,
  useOpenAddClimbDialog,
  useOpenEditClimbDialogContext,
  useSessionAPI,
} from "./session-logger-context"
import TickSelector from "./tick-selector"
import { ThemeColors } from "../../../static/styles"
import TickDescription from "./tick-description"
import AttemptInput from "./attempt-input"
import { EditSessionClimb, SessionClimb } from "../../../static/types"
import RouteTypeSelector from "./route-type-selector"

export function LogClimbDialog() {
  const add = useOpenAddClimbDialog()
  const edit = useOpenEditClimbDialogContext()
  const editClimb = useEditClimbContext()
  const climbType = useAddClimbTypeContext()
  const {
    onClimbAdded,
    onCloseAddClimbDialog,
    onCloseEditClimbDialog,
    onUpdateClimb,
  } = useSessionAPI()
  const [gradesList, setGradesList] = useState<string[]>([])
  const [routeClimbType, setRouteClimbType] = useState<string>("")
  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [selectedTick, setSelectedTick] = useState<string>("")
  const [showAttemptInput, setAttemptInputVisibility] = useState(false)
  const [attemptCount, setAttemptCount] = useState<number | string>("")
  const [attemptError, setAttemptError] = useState<boolean>(false)
  const [unixTime, setUnixTime] = useState<number>(0)

  useMemo(() => {
    if (editClimb && Object.keys(editClimb).length !== 0) {
      editClimb.climbType !== GYM_CLIMB_TYPES[0]
        ? setRouteClimbType(editClimb.climbType)
        : setRouteClimbType("")
      setSelectedGrade(editClimb.grade)
      setSelectedTick(editClimb.tick)
      setAttemptCount(editClimb.attemptCount)
      setAttemptInputVisibility(
        editClimb.tick !== "Onsight" && editClimb.tick !== "Flash"
      )
      setUnixTime(editClimb.unixTime)
    }
  }, [editClimb])

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
        unixTime: unixTime !== 0 ? unixTime : moment().unix(),
      }

      add
        ? onClimbAdded(climbType, climbData)
        : onUpdateClimb({
            ...climbData,
            index: editClimb.index,
          } as EditSessionClimb)

      resetDialog()
    }
  }

  function resetDialog() {
    onCloseAddClimbDialog()
    onCloseEditClimbDialog()
    setRouteClimbType("")
    setSelectedGrade("")
    setSelectedTick("")
    setAttemptCount("")
    setAttemptInputVisibility(false)
    setUnixTime(0)
  }

  return (
    <Dialog open={add || edit}>
      <DialogTitle fontFamily={"poppins"} fontWeight={"bold"}>
        {add ? "Add " : "Edit "} {climbType > 0 ? "route" : "boulder"}
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
            <b>Select tick:</b>
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
            {add ? "Add" : "Edit"}
          </Button>
        )}
        <Button onClick={resetDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
