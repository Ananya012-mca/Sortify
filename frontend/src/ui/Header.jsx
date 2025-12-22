import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockLogout } from "../utils/auth";
import PointsBadge from "./PointsBadge";

export default function Header({ user, onUserChange }) {
  const navigate = useNavigate();
  function handleLogout() {
    mockLogout();
    onUserChange(null);
    navigate("/");
  }
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">S</div>
        <div>
          <h1>Sortify</h1>
          <div className="small">Where smartness turns trash into treasure</div>
        </div>
      </div>

      <div className="header-right">
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/history">History</Link>
        </nav>

        {user ? (
          <>
            <PointsBadge />
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Link to="/profile" className="avatar">{user.name[0].toUpperCase()}</Link>
              <button className="btn ghost" onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <Link to="/login" className="btn">Sign in</Link>
          </div>
        )}
      </div>
    </header>
  );
}
