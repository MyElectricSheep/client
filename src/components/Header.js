import React from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";
import Mason from "./images/mason.jpg";

const Header = () => {
  return (
    <div>
      <header className="header">
        <img src={Mason} className="avatar" alt="avatar" />
        <NavLink to="/" className="deconnexion">
          Déconnexion
        </NavLink>
      </header>
    </div>
  );
};

export default Header;
