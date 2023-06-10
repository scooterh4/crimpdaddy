import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button, Card, CardActions, CardContent, FormControl, TextField } from '@mui/material'

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <>
      <div style={{ minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card variant="outlined" sx={{ maxWidth: 345 }}>
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
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={onLogin}>Login</Button>
          </CardActions>
        </Card>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p>
          Don't have an account?
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <NavLink to="/signup">
          Sign up
        </NavLink>
      </div>
    </>
  )
}

export default Login
