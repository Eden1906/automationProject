import { IDLE_BLOCKER } from "@remix-run/router";
import "../App.css";
import logo from "./assets/logo.png";
import cart_icon from "./assets/cart-icon.png";
import "./Navbar/Navbar.css";
import { useState } from "react";

const NavBar = () => {
  const handlePasswordSubmit = () => {
    const password = prompt("enter password");
    if (password !== null) {
      if (password === "1234") {
        window.location.href = "/Seller";
      } else {
        alert("incorrect password");
      }
    }
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img className="logo-img" src={logo} alt="" />
      </div>
      <ul className="nav-menu">
        <li>
          <a href="/Products">Products</a>
        </li>
        <li>
          <a href="/seller" onClick={handlePasswordSubmit}>
            Sign in as Seller
          </a>
        </li>
      </ul>
      <div className="nav-login-cart">
        <button>Login</button>
        <img className="cart-img" src={cart_icon} alt="" />
        <div className="nav-cart-count">0</div>
      </div>
    </div>

    // <nav className="navbar">
    //   <ul>
    //     <li>
    //       <a href="/Products">products</a>
    //     </li>
    //     <li>
    //       <a href="/seller" onClick={handlePasswordSubmit}>
    //         sign in as seller
    //       </a>
    //     </li>
    //   </ul>
    // </nav>
  );
};

export default NavBar;
