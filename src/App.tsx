import React from 'react'
import LoginSignup from './pages/LoginSignup'
import Home from './pages/Home'
import { BrowserRouter as Router} from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
 
function App() {
  return (
    <Router>
      <div>
        <section>
          <Routes>
            <Route path="/" element={<LoginSignup/>} />
            <Route path="/login" element={<LoginSignup/>} />
            <Route path="/signup" element={<LoginSignup/>} />
            <Route path="/home" element={<Home/>} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
