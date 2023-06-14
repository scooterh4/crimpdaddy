import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import CssBaseline from '@mui/material/CssBaseline';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <CssBaseline />
    <ToastContainer position='top-center' />
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)
