import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaLandmark, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaPlusCircle, FaListAlt, FaChartLine, FaShieldAlt } from "react-icons/fa";

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isAdmin = userProfile?.role === "Admin";

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to={currentUser ? (isAdmin ? "/admin/dashboard" : "/dashboard") : "/"} className="navbar-brand">
          <FaLandmark className="brand-icon" />
          <div className="brand-text">
            <span className="brand-title">GramSeva</span>
            <span className="brand-subtitle">Rural Grievance Portal</span>
          </div>
        </Link>

        {currentUser && (
          <>
            <button className="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle Navigation Menu">
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <nav className={`nav-menu ${mobileMenuOpen ? "open" : ""}`}>
              {isAdmin ? (
                <>
                  <Link to="/admin/dashboard" className={isActive("/admin/dashboard")} onClick={() => setMobileMenuOpen(false)}>
                    <FaChartLine /> Admin Overview
                  </Link>
                  <Link to="/admin/complaints" className={isActive("/admin/complaints")} onClick={() => setMobileMenuOpen(false)}>
                    <FaListAlt /> All Complaints
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={isActive("/dashboard")} onClick={() => setMobileMenuOpen(false)}>
                    <FaChartLine /> Overview
                  </Link>
                  <Link to="/raise-complaint" className={isActive("/raise-complaint")} onClick={() => setMobileMenuOpen(false)}>
                    <FaPlusCircle /> Raise Complaint
                  </Link>
                  <Link to="/my-complaints" className={isActive("/my-complaints")} onClick={() => setMobileMenuOpen(false)}>
                    <FaListAlt /> My Complaints
                  </Link>
                  <Link to="/profile" className={isActive("/profile")} onClick={() => setMobileMenuOpen(false)}>
                    <FaUserCircle /> My Profile
                  </Link>
                </>
              )}

              <div className="user-profile-badge">
                <span className="user-name">{userProfile?.fullName || currentUser.email}</span>
                <span className={`role-tag ${isAdmin ? "role-admin" : "role-citizen"}`}>
                  {isAdmin ? <><FaShieldAlt /> Admin</> : "Citizen"}
                </span>
              </div>

              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </nav>
          </>
        )}

        {!currentUser && (
          <div className="auth-nav-links">
            <Link to="/" className="btn-secondary">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
            <Link to="/admin/login" className="btn-admin-link">Admin Portal</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
