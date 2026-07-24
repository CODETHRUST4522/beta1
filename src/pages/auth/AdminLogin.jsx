import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaShieldAlt, FaEnvelope, FaLock, FaSignInAlt, FaArrowLeft } from "react-icons/fa";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, userProfile } = useAuth();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid administrative credentials.");
      } else {
        setError(err.message || "Failed to log in as administrator.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container admin-bg">
      <div className="auth-card admin-card">
        <div className="auth-header admin-header">
          <FaShieldAlt className="admin-badge-icon" />
          <h2>Administrative Portal</h2>
          <p>Sign in with your administrator credentials</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleAdminLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                id="admin-email"
                type="email"
                placeholder="admin@gramseva.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                id="admin-password"
                type="password"
                placeholder="Administrator password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit btn-admin" disabled={submitting}>
            {submitting ? "Authenticating..." : <><FaSignInAlt /> Admin Sign In</>}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/" className="back-link"><FaArrowLeft /> Return to Citizen Login</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
