import React, { useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import { BrowserRouter as Router} from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
 
function App() {
  return (
    <Router>
      <div>
        <section>
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/home" element={<Home/>} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
