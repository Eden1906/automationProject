import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import NavBar from './components/Navbar'
import Products from './components/Products'
import Home from './components/Home'
import Seller from './components/Seller'


function App() {
  return (
    <Router>
      <div className = "App">
        <NavBar/>
        <Routes>
          <Route path="/Products" element={<Products />} />
          <Route path="/Home" element= {<Home />} />
          <Route path="/Seller" element= {<Seller />} />
        </Routes>
      </div>
    </Router>
    
  )
}

export default App;
