import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
// import logo from "../../images/logo.jpg"; // Removed local import
import LoginModal from "../Login/Login";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfilePhoto, setUserProfilePhoto] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user profile photo
  const fetchUserProfilePhoto = async (userRole, token) => {
    if (!token) return;
    try {
      let apiUrl = "";
      switch (userRole) {
        case "student":
          apiUrl = "http://localhost:5000/api/students/profile";
          break;
        case "coach":
          apiUrl = "http://localhost:5000/api/coaches/profile";
          break;
        case "seniorCoach":
          apiUrl = "http://localhost:5000/api/srcoach/profile";
          break;
        default:
          return;
      }
      const res = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const photoUrl = data.profilePhotoUrl || data.student?.profilePhotoUrl || data.coach?.profilePhotoUrl || data.user?.profilePhotoUrl;
        if (photoUrl) {
          // Add cache busting parameter to force reload
          const cacheBustUrl = photoUrl.includes('?') ? `${photoUrl}&t=${Date.now()}` : `${photoUrl}?t=${Date.now()}`;
          setUserProfilePhoto(cacheBustUrl);
        } else {
          setUserProfilePhoto(null);
        }
      }
    } catch (err) {
      console.error("Error fetching profile photo:", err);
    }
  };

  // Check for logged-in user on mount and when location changes
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchUserProfilePhoto(parsedUser.role, parsedUser.token);
      } catch (err) {
        console.error("Error parsing user data:", err);
        localStorage.removeItem("user");
      }
    } else {
      setUser(null);
      setUserProfilePhoto(null);
    }
  }, [location]);

  // Listen for profile photo updates
  useEffect(() => {
    const handleProfilePhotoUpdate = async (event) => {
      if (event.detail && event.detail.profilePhotoUrl) {
        // Directly set the photo URL from the event with cache busting
        const photoUrl = event.detail.profilePhotoUrl;
        const cacheBustUrl = photoUrl.includes('?') ? `${photoUrl}&t=${Date.now()}` : `${photoUrl}?t=${Date.now()}`;
        setUserProfilePhoto(cacheBustUrl);
      } else {
        // Refetch profile photo from API
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            await fetchUserProfilePhoto(parsedUser.role, parsedUser.token);
          } catch (err) {
            console.error("Error fetching updated profile photo:", err);
          }
        }
      }
    };

    window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);

    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    };
  }, []); // Empty deps array - we'll get user from localStorage inside

  // Determine if we're on a dashboard page
  const isDashboardPage = 
    location.pathname === "/student-dashboard" ||
    location.pathname === "/coach-dashboard" ||
    location.pathname === "/srcoach-dashboard";

  const logout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setUser(null);
    setUserProfilePhoto(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setShowMenu(false);
    setIsOpen(false);
    navigate("/");
    window.location.reload(); // Force page refresh to clear all state
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.user-menu')) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMenu]);

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
          {/* Using text logo for now to reflect the name change clearly, or update image source if available */}
          <h1 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", letterSpacing: '1px' }}>
            ELITE <span style={{ color: '#fff' }}>SPORT</span>
          </h1>
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
                    <div style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: "#f0f4f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      {userProfilePhoto ? (
                        <img
                          src={userProfilePhoto}
                          alt={getUserDisplayName()}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            console.error("Profile photo failed to load");
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0b66c3" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      )}
                    </div>
                    <span className="user-info">
                      <span className="user-name">{getUserDisplayName()}</span>
                      <span className="user-role">{getUserRoleDisplay()}</span>
                    </span>
                  </div>
                  {showMenu && (
                    <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                      <p className="dropdown-user-name">{getUserDisplayName()}</p>
                      <p className="dropdown-user-role">{getUserRoleDisplay()}</p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(getDashboardRoute(user.role));
                          setShowMenu(false);
                          setIsOpen(false);
                        }}
                      >
                        Go to Dashboard
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          logout(e);
                        }}
                        className="logout-btn"
                      >
                        Logout
                      </button>
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
                  <div style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#f0f4f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {userProfilePhoto ? (
                      <img
                        src={userProfilePhoto}
                        alt={getUserDisplayName()}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          console.error("Profile photo failed to load");
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0b66c3" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </div>
                  <span className="user-info">
                    <span className="user-name">{getUserDisplayName()}</span>
                    <span className="user-role">{getUserRoleDisplay()}</span>
                  </span>
                </div>
                {showMenu && (
                  <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    <p className="dropdown-user-name">{getUserDisplayName()}</p>
                    <p className="dropdown-user-role">{getUserRoleDisplay()}</p>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        logout(e);
                      }}
                      className="logout-btn"
                    >
                      Logout
                    </button>
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
