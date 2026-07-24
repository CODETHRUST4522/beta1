import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile } from "../../services/userService";
import { FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaSave, FaCheck } from "react-icons/fa";

function Profile() {
  const { currentUser, userProfile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [village, setVillage] = useState("");
  const [taluka, setTaluka] = useState("");
  const [district, setDistrict] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || "");
      setMobile(userProfile.mobile || "");
      setVillage(userProfile.village || "");
      setTaluka(userProfile.taluka || "");
      setDistrict(userProfile.district || "");
    }
  }, [userProfile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!fullName || !mobile || !village || !taluka || !district) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    try {
      await updateUserProfile(currentUser.uid, {
        fullName,
        mobile,
        village,
        taluka,
        district
      });

      await refreshProfile();
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Citizen Profile Settings</h2>
        <p>Manage your account details and village location information</p>
      </div>

      <div className="profile-card">
        {message && <div className="success-banner"><FaCheck /> {message}</div>}
        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleProfileUpdate} className="profile-form">
          <div className="form-group">
            <label><FaEnvelope /> Email Address (Read-only)</label>
            <input type="email" value={currentUser?.email || ""} disabled className="disabled-input" />
          </div>

          <div className="form-group">
            <label htmlFor="fullName"><FaUser /> Full Name *</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile"><FaPhone /> Mobile Number *</label>
            <input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="village"><FaMapMarkerAlt /> Village *</label>
              <input
                id="village"
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="taluka"><FaMapMarkerAlt /> Taluka *</label>
              <input
                id="taluka"
                type="text"
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="district"><FaMapMarkerAlt /> District *</label>
            <input
              id="district"
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving Changes..." : <><FaSave /> Update Profile</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
