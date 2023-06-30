import { db } from "../firebase"
import { collection, doc, getDoc, addDoc, setDoc } from "firebase/firestore"
import { GYM_CLIMB_TYPES } from "../static/constants"

const collectionName = "climbingLogs"

// log an indoor climb
export const LogClimb = async (
  userId: string,
  climbType: number,
  grade: string,
  tick: string,
  attempts: string | number
): Promise<string> => {
  const dateTime = new Date()
  const collectionPath = `/${collectionName}/${userId}/${dateTime.getFullYear()}/indoor/climbs`

  const climbData = {
    ClimbType: GYM_CLIMB_TYPES[climbType],
    Grade: grade,
    Tick: tick,
    Attempts: attempts,
    DateTime: dateTime,
  }

  try {
    const userDoc = doc(db, `/${collectionName}/${userId}`)

    // Check whether the user doc exists, if not, create it
    await getDoc(userDoc).then((document) => {
      if (!document.exists()) {
        const addUser = doc(db, `${collectionName}`, userId)

        setDoc(addUser, { userId: userId }).then(() => {
          console.log("User doc created for user: ", userId)

          addDoc(collection(db, collectionPath), climbData).then((res) => {
            console.log("Document written with ID: ", res.id)
          })
        })
      } else {
        // user doc exists, so just add the climb
        addDoc(collection(db, collectionPath), climbData).then((res) => {
          console.log("Document written with ID: ", res.id)
        })
      }
    })
  } catch (error) {
    console.log("Error retreiving all users: ", error)
  }
  return "Success"
}
