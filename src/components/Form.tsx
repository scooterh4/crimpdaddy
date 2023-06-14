import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, FormControl, TextField } from '@mui/material';
import quickdraws from '../images/quickdraws-unsplash.jpg';

interface FormProps {
  title: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleAction: () => void;
}

function Login(props: FormProps) {
  const { title, setEmail, setPassword, handleAction } = props;
  const isLogin = title === 'Login';

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAction();
    }
  };

  return (
    <>
      <div style={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card variant="outlined" sx={{ maxWidth: 345 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardContent>
              <FormControl>
                <TextField
                  required
                  placeholder="Email"
                  sx={{ width: 300 }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  required
                  placeholder="Password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button variant="contained" type="submit" onClick={() => handleAction()}>
                  {title}
                </Button>
              </FormControl>
            </CardContent>
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', textAlign: 'center', color: 'white' }}>
        <p>{isLogin ? "Don't have an account?" : 'Already have an account? '}</p>
      </div>  
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', textAlign: 'center', color: 'white' }}>
        <NavLink to={isLogin ? '/signup' : '/login'}>{isLogin ? 'Sign up' : 'Login'}</NavLink>
      </div>
    </>
  );
}

export default Login;
