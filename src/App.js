import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import NavBar from './components/Navbar'
import Products from './components/Products'
import Home from './components/Home'


function App() {
  return (
    <Router>
      <div classname = "App">
        <NavBar/>
        <Routes>
          <Route path="/Products" element={<Products />} />
          <Route path="/Home" element= {<Home />} />
        </Routes>
      </div>
    </Router>
    
  )
}

export default App;
