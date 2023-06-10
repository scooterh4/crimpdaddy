import React, { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Button, Card, CardActions, CardContent, FormControl, TextField } from '@mui/material'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const isLogin = useLocation().pathname.includes('login') || useLocation().pathname == '/'

  const onLogin = (e: any) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/home")
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
        const user = userCredential.user;
        console.log(user);
        navigate("/login")
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
  }

  return (
    <>
      <div style={{ minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card variant="outlined" sx={{ maxWidth: 345 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CardContent>
              <FormControl>
                <TextField
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ width: 300 }}
                />
                <TextField
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormControl>
            </CardContent>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CardActions>
              <Button 
                variant="contained" 
                onClick={ isLogin ? onLogin : onCreateUser }
              >
                { isLogin ? "Login" : 'Sign up'}
              </Button>
            </CardActions>
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p>
          { isLogin ? 'Don\'t have an account?' : 'Already have an account?' }
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <NavLink to={ isLogin ? "/signup" : "/login" }>
          { isLogin ? 'Sign up' : 'Sign in'}
        </NavLink>
      </div>
    </>
  )
}

export default Login
