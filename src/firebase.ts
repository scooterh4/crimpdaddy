import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// import { getFirestore } from 'firebase/database/dist/firestore'

// TODO need to setup get these variables out of the env file
// i.e. process.env.REACT_APP_FIREBASE_MEASUREMENT_ID 
const app = initializeApp({
  apiKey: "AIzaSyBWhsaC6888q3kV2oxDIqtETpYjJ_va8IY",
  authDomain: "crimpdaddy-db2af.firebaseapp.com",
  projectId: "crimpdaddy-db2af",
  storageBucket: "crimpdaddy-db2af.appspot.com",
  messagingSenderId: "908883030660",
  appId: "1:908883030660:web:e1b52563a8985c17d588d1",
  measurementId: "G-2MR09LRHZW"
});

// export const firestore = getFirestore(app)
export const auth = getAuth(app)
export default app