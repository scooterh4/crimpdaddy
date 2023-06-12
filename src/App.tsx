import React, { useState, useEffect } from 'react'
import Form from './components/Form'
import Dashboard from './pages/Dashboard'
import { BrowserRouter as Router} from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import app, { auth } from './firebase' 

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
  
  const onLogin = (e: any) => {
    e.preventDefault();
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

  const onCreateUser = async (e: any) => {
    e.preventDefault()
    
    await createUserWithEmailAndPassword(auth, email, password)
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

  return (
    <Routes>
      <Route path="/" element={<Form title="Login" setEmail={setEmail} setPassword={setPassword} handleAction={onLogin} />} />
      <Route path="/login" element={<Form title="Login" setEmail={setEmail} setPassword={setPassword} handleAction={onLogin}/>} />
      <Route path="/signup" element={<Form title="Sign up" setEmail={setEmail} setPassword={setPassword} handleAction={onCreateUser} />} />
      <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
  );
}

export default App;
