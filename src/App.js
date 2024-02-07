import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import NavBar from './components/Navbar'
import Products from './components/Products'
import Seller from './components/Seller'


function App() {
  return (
    <Router>
      <div className = "App">
        <NavBar/>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/Seller" element= {<Seller />} />
        </Routes>
      </div>
    </Router>
    
  )
}

export default App;
