import React, { useState, useEffect } from 'react'
import Form from './components/Form'
import ProtectedRoute, { ProtectedRouteProps } from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase' 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const authToken = sessionStorage.getItem('Auth Token');

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
    isAuthenticated: !!authToken,
    authenticationPath: '/login',
  };
  
  // Login / sign up functionality
  const handleAction = (actionId: number) => {
    if (actionId === 1) {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sessionStorage.setItem('Auth Token', userCredential.user.refreshToken)
        navigate("/dashboard")
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          toast.error('Please check your login credentials')
        } 
        else if (error.code === 'auth/invalid-email') {
          toast.error('The email given does not have an account. Please sign up first')
        } 
        else {
          toast.error('Uh oh! An unexpected error occurred')
          console.log(error.code, error.message)
        }
      })
    }
    else if (actionId === 2) {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/login")
        toast.success('Registration successful! Please login with your credentials')
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          toast.error('Email already in use')
        }
        else {
          toast.error('Uh oh! An unexpected error occurred')
          console.log(error.code, error.message);
        }
      });
    }
  }

  return (
    <>
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
        <Route path='dashboard' 
              element={
                <ProtectedRoute {...defaultProtectedRouteProps} 
                                outlet= {<Dashboard />} 
                />} 
        />
      </Routes>
    </>
  );
}

export default App;
