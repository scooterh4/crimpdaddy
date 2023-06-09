import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button, Card, CardActions, CardContent, FormControl, Grid, TextField } from '@mui/material'

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
    <Grid 
      container 
      direction={'column'} 
      alignContent={'center'}
      justifyContent={'center'}
      sx={{ minHeight: "50vh" }}
    >
      <Grid 
        container
        alignContent={'center'}
        justifyContent={'center'}
      >
        <Card variant="outlined" sx={{ maxWidth: 345 }}>
          <CardContent>
            <FormControl>
              <TextField 
                placeholder='Email' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                sx={{ width: 300 }}/>
              <TextField 
                placeholder='Password' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required />  
            </FormControl>
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={onLogin}>Login</Button>
          </CardActions>
        </Card>
      </Grid>

        <Grid 
          container 
          direction={'row'} 
          alignContent={'center'}
          justifyContent={'center'}
        >
          <p>
            Dont have an account? 
          </p>
        </Grid>
        <Grid 
          container 
          direction={'row'} 
          alignContent={'center'}
          justifyContent={'center'}
        >
          <NavLink to="/signup">
            Sign up
          </NavLink>
        </Grid>
      </Grid>
    </>
  )
}

export default Login