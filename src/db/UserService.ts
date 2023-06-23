import { db } from "../firebase"
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore"
import { AppUser } from "../static/types"

const collectionName = "users"

// retrieve all users
export const allUsers = async (): Promise<Array<AppUser>> => {
  const snapshot = collection(db, collectionName)
  let data: Array<AppUser> = []

  try {
    onSnapshot(snapshot, (querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        data.push({
          id: doc.id,
          email: "",
          ...doc.data(),
        })
      })
    })
  } catch (error) {
    console.log("Error retreiving all users: ", error)
  }

  return data as Array<AppUser>
}

// retrieve a user by id
export const usersById = async (propId: string): Promise<AppUser> => {
  const docRef = doc(db, collectionName, propId)
  let data: AppUser = {} as AppUser

  try {
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      data = {
        id: propId,
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
