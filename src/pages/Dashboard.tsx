import React from 'react'
import { signOut } from "firebase/auth"
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import { Button, Typography } from '@mui/material'

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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h1" component="div" gutterBottom>
          { user.substring(0, user.indexOf("@")) }
        </Typography>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}> 
        <Typography variant="h3" component="div" gutterBottom>
          Welcome to Crimpdaddy
        </Typography>
      </div>
      
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}> 
        <Button variant='contained' onClick={ handleLogout }>
          Logout
        </Button>
      </div>
    </>
  )
}
 
export default Home;