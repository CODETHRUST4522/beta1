import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

function NotFound() {
  return (
    <div className="page-container not-found-container">
      <div className="not-found-card card">
        <FaExclamationTriangle className="not-found-icon" />
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-primary">
          <FaHome /> Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;