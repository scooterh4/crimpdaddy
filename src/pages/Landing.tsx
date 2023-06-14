import React from 'react'
import background from '../images/quickdraws-unsplash.jpg'
import { Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Landing() {
  let navigate = useNavigate()

  return (
    <>
      <Box style={{ height: '100vh', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            filter: 'sepia(0.75)',
          }}
        />
        <div style={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h1>Log your climbs. Track your progress</h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', textAlign: 'center', color: 'white' }}>
          <Button variant='contained' onClick={() => navigate('/login')}>Login</Button>
        </div>
      </Box>
    </>
  )
}

export default Landing