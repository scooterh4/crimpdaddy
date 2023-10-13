import React, { useEffect } from "react"
import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppUser } from "../../static/types"
import {
  Unsubscribe,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import { auth, provider } from "../../firebase"
import { toast } from "react-toastify"
import { Routes } from "../app/router"

interface IAuthContext {
  user: AppUser | null
  setUser: (user: AppUser | null) => void
  loginUser: (email: string, password: string) => void
  googleLogin: () => void
  logoutUser: () => void
}

const authDefaultState: IAuthContext = {
  user: null,
  setUser: () => {},
  loginUser: () => {},
  googleLogin: () => {},
  logoutUser: () => {},
}

const AuthContext = createContext<IAuthContext>(authDefaultState)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    console.log("Auth context rendered")
    console.log("Auth context user", user)

    const subscriber: Unsubscribe = onAuthStateChanged(
      auth,
      (persistedUser) => {
        if (persistedUser && !user) {
          console.log("Auth context resetting user")
          setUser({
            id: persistedUser.uid,
            email: persistedUser.email ? persistedUser.email : "",
          })
        }
      }
    )
    //Unsubscribe the listener when the component is unmounted
    return () => subscriber()
  }, [])

  // call this function when you want to authenticate the user
  const loginUser = async (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sessionStorage.setItem("authToken", userCredential.user.refreshToken)
        setUser({
          id: userCredential.user.uid,
          email: userCredential.user.email ? userCredential.user.email : "",
        })
        navigate(Routes.dashboard)
      })
      .catch((error) => {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          toast.error("Please check your login credentials")
        } else if (error.code === "auth/invalid-email") {
          toast.error(
            "The email given does not have an account. Please sign up first"
          )
        } else if (error.code === "auth/missing-password") {
          toast.error("You forgot to enter your password silly!")
        } else {
          toast.error("Uh oh! An unexpected error occurred")
          console.log(error.code, error.message)
        }
      })
    setUser(user)
    navigate(Routes.dashboard)
  }

  const googleLogin = async () => {
    signInWithPopup(auth, provider).then((userCredential) => {
      sessionStorage.setItem("authToken", userCredential.user.refreshToken)
      setUser({
        id: userCredential.user.uid,
        email: userCredential.user.email ? userCredential.user.email : "",
      })
      navigate(Routes.dashboard)
    })
  }

  // call this function to sign out logged in user
  const logoutUser = async () => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("authToken")
        setUser(null)
        sessionStorage.removeItem("climbingData") // clear app data
        toast.success("Goodbye!", { toastId: "logoutSuccess" })
        navigate(Routes.login)
      })
      .catch((error) => {
        console.log(error.code, error.message)
      })
  }

  const authContextValue: IAuthContext = {
    user,
    setUser,
    loginUser,
    googleLogin,
    logoutUser,
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
