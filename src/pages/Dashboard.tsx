import React, { useEffect } from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
 
const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token');

    if (authToken) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [])

  const handleLogout = () => {               
    signOut(auth).then(() => {
      sessionStorage.removeItem('Auth Token')
      navigate("/");
      console.log("Signed out successfully")
    }).catch((error) => {
    // An error happened.
    });
  }
  
  return(
    <>
        <h1>
          Crimpdaddy
        </h1>

        <div>
          <button onClick={ handleLogout }>
            Logout
          </button>
        </div>
    </>
  )
}
 
export default Home;