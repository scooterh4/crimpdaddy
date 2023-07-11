import { db } from "../firebase"
import {
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore"
import { ClimbLog, MonthlyClimbData } from "../static/types"

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

// get all climbs for a user by month
export const GetMonthlyClimbsByUser = async (
  userId: string
): Promise<MonthlyClimbData[]> => {
  let result: MonthlyClimbData[] = [
    { month: "Jan", numberOfClimbs: 0 },
    { month: "Feb", numberOfClimbs: 0 },
    { month: "Mar", numberOfClimbs: 0 },
    { month: "Apr", numberOfClimbs: 0 },
    { month: "May", numberOfClimbs: 0 },
    { month: "Jun", numberOfClimbs: 0 },
    { month: "Jul", numberOfClimbs: 0 },
    { month: "Aug", numberOfClimbs: 0 },
    { month: "Sep", numberOfClimbs: 0 },
    { month: "Oct", numberOfClimbs: 0 },
    { month: "Nov", numberOfClimbs: 0 },
    { month: "Dec", numberOfClimbs: 0 },
  ]
  const year = new Date().getFullYear()
  const collectionPath = `/${collectionName}/${userId}/${year}/indoor/climbs`

  try {
    const querySnapshot = await getDocs(collection(db, collectionPath))

    querySnapshot.forEach((doc) => {
      const climb = doc.data() as {
        UserId: string
        Attempts: number
        DateTime: Timestamp
      }

      const date = climb.DateTime.toDate()

      result.find(
        (m) => m.month === date.toLocaleString("default", { month: "short" })
      )!.numberOfClimbs += climb.Attempts
    })
  } catch (error) {
    console.log("Error retreiving all users: ", error)
  }

  return result as MonthlyClimbData[]
}
