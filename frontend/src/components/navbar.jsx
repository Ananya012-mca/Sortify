
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, [location]);

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <h2 onClick={() => navigate("/")}>SORTIFY</h2>
      <div>
        <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
        <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>Analytics</Link>
        <Link to="/upload" className={isActive("/upload") ? "active" : ""}>Classify</Link>
        <Link to="/rewards" className={isActive("/rewards") ? "active" : ""}>Rewards</Link>

        {isLoggedIn ? (
          <>
            <Link to="/profile" className={isActive("/profile") ? "active" : ""}>Profile</Link>
            <button onClick={logout} className="nav-logout-btn">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ marginRight: '8px', verticalAlign: 'middle' }}
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
