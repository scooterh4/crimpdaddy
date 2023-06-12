import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Card, CardActions, CardContent, FormControl, TextField } from '@mui/material'

interface FormProps {
  title: string,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  handleAction: () => void
}

function Login(props: FormProps) {
  const { title, setEmail, setPassword, handleAction } = props
  const isLogin = title === "Login"

  return (
    <>
      <div style={{ minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card variant="outlined" sx={{ maxWidth: 345 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CardContent>
              <FormControl>
                <TextField
                  placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ width: 300 }}
                />
                <TextField
                  type='password'
                  placeholder='Password'
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
                onClick={ () => handleAction() }
              >
                { title }
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
          { isLogin ? 'Sign up' : 'Login' }
        </NavLink>
      </div>
    </>
  )
}

export default Login
