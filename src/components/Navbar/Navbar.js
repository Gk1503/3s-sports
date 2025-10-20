import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../images/logo.jpg";
import LoginModal from "../Login/Login";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null); // user state from backend
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    setShowMenu(false);
    navigate("/");
    setIsOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="3SPORTS Logo" />
        </div>

        {/* Navigation Links */}
        <ul className={isOpen ? "nav-links open" : "nav-links"}>
          <li><NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/academy" onClick={() => setIsOpen(false)}>Academy</NavLink></li>
          <li><NavLink to="/coaches" onClick={() => setIsOpen(false)}>Coaches</NavLink></li>
          <li><NavLink to="/matches" onClick={() => setIsOpen(false)}>Matches</NavLink></li>
          <li><NavLink to="/gallery" onClick={() => setIsOpen(false)}>Gallery</NavLink></li>
          <li><NavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</NavLink></li>

          {/* Login / User Avatar */}
          <li>
  {!user ? (
    <button
      className="btn-login"
      onClick={() => {
        setShowLogin(true);
        setIsOpen(false);
      }}
    >
      Login
    </button>
  ) : (
    <div className="user-menu">
      <img
        src={user.photo || "https://via.placeholder.com/45"}
        alt={user.username}
        className="user-avatar"
        onClick={() => setShowMenu(!showMenu)}
      />
      {showMenu && (
        <div className="dropdown-menu">
          <p>{user.username}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  )}
</li>

        </ul>

        {/* Mobile Hamburger */}
        <div
          className={isOpen ? "menu-toggle open" : "menu-toggle"}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* Login Modal */}
      {showLogin && <LoginModal closeModal={() => setShowLogin(false)} setUser={setUser} />}
    </>
  );
};

export default Navbar;
