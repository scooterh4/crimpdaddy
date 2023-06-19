import { db } from "../firebase"
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore"
import { CdUser } from "../models/types"

const collectionName = "users"

// retrieve all users
export const allUsers = async (): Promise<Array<CdUser>> => {
  const snapshot = collection(db, collectionName)
  let data: Array<CdUser> = []

  try {
    onSnapshot(snapshot, (querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        data.push({
          id: doc.id,
          firstName: "",
          lastName: "",
          email: "",
          ...doc.data(),
        })
      })
    })
  } catch (error) {
    console.log("Error retreiving all users: ", error)
  }

  return data as Array<CdUser>
}

// retrieve a user by id
export const usersById = async (propId: string): Promise<CdUser> => {
  const docRef = doc(db, collectionName, propId)
  let data: CdUser = {} as CdUser

  try {
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      data = {
        id: propId,
        firstName: "",
        lastName: "",
        email: "",
        ...docSnap.data(),
      }
    } else {
      console.log("Document does not exist")
    }
  } catch (error) {
    console.log("Error retreiving the user doc: ", error)
  }

  return data
}
