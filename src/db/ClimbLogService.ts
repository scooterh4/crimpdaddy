import { db } from "../firebase"
import {
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  getDocs,
} from "firebase/firestore"
import { ClimbLog } from "../static/types"

const collectionName = "climbingLogs"

// log an indoor climb
export const LogClimb = async (climbData: ClimbLog): Promise<string> => {
  const collectionPath = `/${collectionName}/${
    climbData.UserId
  }/${climbData.DateTime.getFullYear()}/indoor/climbs`

  try {
    const userDoc = doc(db, `/${collectionName}/${climbData.UserId}`)

    // Check whether the user doc exists, if not, create it
    await getDoc(userDoc).then((document) => {
      if (!document.exists()) {
        const addUser = doc(db, `${collectionName}`, climbData.UserId)

        setDoc(addUser, { userId: climbData.UserId }).then(() => {
          console.log("User doc created for user: ", climbData.UserId)

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

// get all climbs for a user
export const GetClimbsByUser = async (userId: string): Promise<ClimbLog[]> => {
  const result: ClimbLog[] = []
  const year = new Date().getFullYear()
  const collectionPath = `/${collectionName}/${userId}/${year}/indoor/climbs`

  try {
    const querySnapshot = await getDocs(collection(db, collectionPath))

    querySnapshot.forEach((doc) => {
      result.push(doc.data() as ClimbLog)
    })
  } catch (error) {
    console.log("Error retreiving all users: ", error)
  }

  return result as ClimbLog[]
}
