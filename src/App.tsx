import React, { useState, useEffect } from 'react'
import Form from './components/Form'
import Dashboard from './pages/Dashboard'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase' 

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token')

    if (authToken) {
      navigate('/dashboard')
    }
  }, [])
  
  const handleAction = (actionId: number) => {
    if (actionId === 1) {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        sessionStorage.setItem('Auth Token', user.refreshToken)
        navigate("/dashboard")
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
      })
    }
    else if (actionId === 2) {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        //const user = userCredential.user;
        console.log(userCredential.user);
        navigate("/login")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
    }
  }

  return (
    <Routes>
      <Route path="/" 
            element={
              <Form title="Login" 
                    setEmail={setEmail} 
                    setPassword={setPassword} 
                    handleAction={() => handleAction(1)} />
            } 
      />
      <Route path="/login" 
            element={
              <Form title="Login" 
                    setEmail={setEmail} 
                    setPassword={setPassword} 
                    handleAction={() => handleAction(1)} />
            } 
      />
      <Route path="/signup"
            element={
              <Form title="Sign up" 
                    setEmail={setEmail} 
                    setPassword={setPassword} 
                    handleAction={() => handleAction(2)} />
            } 
      />
      <Route path="/dashboard" 
            element={ <Dashboard/> } />
    </Routes>
  );
}

export default App;
