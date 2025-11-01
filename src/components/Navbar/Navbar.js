import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../images/logo.jpg";
import LoginModal from "../Login/Login";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for logged-in user on mount and when location changes
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user data:", err);
        localStorage.removeItem("user");
      }
    } else {
      setUser(null);
    }
  }, [location]);

  // Determine if we're on a dashboard page
  const isDashboardPage = 
    location.pathname === "/student-dashboard" ||
    location.pathname === "/coach-dashboard" ||
    location.pathname === "/srcoach-dashboard";

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setShowMenu(false);
    setIsOpen(false);
    navigate("/");
    window.location.reload(); // Force page refresh to clear all state
  };

  const getDashboardRoute = (role) => {
    switch (role) {
      case "student":
        return "/student-dashboard";
      case "coach":
        return "/coach-dashboard";
      case "seniorCoach":
        return "/srcoach-dashboard";
      default:
        return "/";
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    return user.username || user.name || "User";
  };

  const getUserRoleDisplay = () => {
    if (!user) return "";
    switch (user.role) {
      case "student":
        return "Student";
      case "coach":
        return "Coach";
      case "seniorCoach":
        return "Senior Coach";
      default:
        return user.role || "User";
    }
  };

  return (
    <>
      <nav id="navbar" className={isDashboardPage ? "dashboard-mode" : ""}>
        {/* Logo */}
        <div id="navbar-logo">
          <img src={logo} alt="3S SPORTS Logo" />
        </div>

        {/* Navigation Links - Only show when NOT on dashboard pages */}
        {!isDashboardPage && (
          <ul id="navbar-links" className={isOpen ? "open" : ""}>
            <li>
              <NavLink to="/" onClick={() => setIsOpen(false)}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/academy" onClick={() => setIsOpen(false)}>
                Academy
              </NavLink>
            </li>
            <li>
              <NavLink to="/coaches" onClick={() => setIsOpen(false)}>
                Coaches
              </NavLink>
            </li>
            <li>
              <NavLink to="/gallery" onClick={() => setIsOpen(false)}>
                Gallery
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={() => setIsOpen(false)}>
                Contact
              </NavLink>
            </li>

            {/* Login / User Profile */}
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
                  <div
                    className="user-profile-display"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <img
                      src="https://via.placeholder.com/45"
                      alt={getUserDisplayName()}
                      className="user-avatar"
                    />
                    <span className="user-info">
                      <span className="user-name">{getUserDisplayName()}</span>
                      <span className="user-role">{getUserRoleDisplay()}</span>
                    </span>
                  </div>
                  {showMenu && (
                    <div className="dropdown-menu">
                      <p className="dropdown-user-name">{getUserDisplayName()}</p>
                      <p className="dropdown-user-role">{getUserRoleDisplay()}</p>
                      <button
                        onClick={() => {
                          navigate(getDashboardRoute(user.role));
                          setShowMenu(false);
                          setIsOpen(false);
                        }}
                      >
                        Go to Dashboard
                      </button>
                      <button onClick={logout}>Logout</button>
                    </div>
                  )}
                </div>
              )}
            </li>
          </ul>
        )}

        {/* Dashboard Mode - Only Profile/Logout */}
        {isDashboardPage && (
          <div className="dashboard-nav-section">
            {user ? (
              <div className="user-menu">
                <div
                  className="user-profile-display"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <img
                    src="https://via.placeholder.com/45"
                    alt={getUserDisplayName()}
                    className="user-avatar"
                  />
                  <span className="user-info">
                    <span className="user-name">{getUserDisplayName()}</span>
                    <span className="user-role">{getUserRoleDisplay()}</span>
                  </span>
                </div>
                {showMenu && (
                  <div className="dropdown-menu">
                    <p className="dropdown-user-name">{getUserDisplayName()}</p>
                    <p className="dropdown-user-role">{getUserRoleDisplay()}</p>
                    <button onClick={logout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn-login"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            )}
          </div>
        )}

        {/* Mobile Hamburger - Only show when NOT on dashboard */}
        {!isDashboardPage && (
          <div
            id="navbar-toggle"
            className={isOpen ? "open" : ""}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          closeModal={() => setShowLogin(false)}
          setUser={setUser}
        />
      )}
    </>
  );
};

export default Navbar;
