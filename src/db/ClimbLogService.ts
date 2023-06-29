import { get } from "http"
import { db } from "../firebase"
import { collection, doc, getDoc, addDoc, onSnapshot } from "firebase/firestore"
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

  console.log(dateTime.getUTCDate)

  const climbData = {
    ClimbType: GYM_CLIMB_TYPES[climbType],
    Grade: grade,
    Tick: tick,
    Attempts: attempts,
    DateTime: dateTime,
  }

  try {
    const userDoc = addDoc(collection(db, collectionPath), climbData).then(
      (doc) => {
        console.log("Document written with ID: ", doc.id)
      }
    )
  } catch (error) {
    console.log("Error retreiving all users: ", error)
  }

  // let data: Array<AppUser> = []

  // try {
  //   onSnapshot(snapshot, (querySnapshot) => {
  //     querySnapshot.docs.map((doc) => {
  //       data.push({
  //         id: doc.id,
  //         email: "",
  //         ...doc.data(),
  //       })
  //     })
  //   })
  // } catch (error) {
  //   console.log("Error retreiving all users: ", error)
  // }

  return "Success"
}
