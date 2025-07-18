// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Employee Management System
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            {/* ⭐ Aligning this link with the root route in App.jsx */}
            <Link to="/" className="nav-links">
              Employee Registration
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/employees" className="nav-links">
              Employee List
            </Link>
          </li>
          <li className="nav-item">
            {/* ⭐ FIX: Changed to "/hr-policies" to match the route in App.jsx */}
            <Link to="/hr-policies" className="nav-links">
              HR Policy
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/calculate-increment" className="nav-links">
              Calculate Increment Salary
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;