import React from 'react'
import { signOut } from "firebase/auth"
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 

const Home = () => {
  const navigate = useNavigate()
  const user = (auth.currentUser && auth.currentUser.email || '')

  const handleLogout = () => {               
    signOut(auth).then(() => {
      sessionStorage.removeItem('Auth Token')

      toast.success('Goodbye!', 
        { toastId: 'logoutSuccess'}
      )

      navigate("/")
    }).catch((error) => {
      console.log(error.code, error.message)
    });
  }

  return(
    <>
      <h1>
        Hello { user.substring(0, user.indexOf("@")) }
      </h1>
      <h2>
        Welcome to Crimpdaddy
      </h2>

      <div>
        <button onClick={ handleLogout }>
          Logout
        </button>
      </div>
    </>
  )
}
 
export default Home;