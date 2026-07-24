import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaUserCheck } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [village, setVillage] = useState("");
  const [taluka, setTaluka] = useState("");
  const [district, setDistrict] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !mobile || !village || !taluka || !district || !email || !password) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        email,
        password,
        fullName,
        mobile,
        village,
        taluka,
        district,
        role: "Citizen"
      });
      alert("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>Create Citizen Account</h2>
          <p>Join GramSeva to voice grievances and track resolutions</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form grid-form">
          <div className="form-group full-width">
            <label htmlFor="fullName">Full Name *</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                id="fullName"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number *</label>
            <div className="input-with-icon">
              <FaPhone className="input-icon" />
              <input
                id="mobile"
                type="tel"
                placeholder="10-digit Mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="village">Village *</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="input-icon" />
              <input
                id="village"
                type="text"
                placeholder="Village Name"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="taluka">Taluka *</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="input-icon" />
              <input
                id="taluka"
                type="text"
                placeholder="Taluka"
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="district">District *</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="input-icon" />
              <input
                id="district"
                type="text"
                placeholder="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit full-width" disabled={submitting}>
            {submitting ? "Creating Account..." : <><FaUserCheck /> Create Account</>}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;