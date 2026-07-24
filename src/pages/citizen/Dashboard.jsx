import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserComplaints, createSuggestion } from "../../services/complaintService";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { 
  FaPlusCircle, 
  FaListAlt, 
  FaUser, 
  FaLightbulb, 
  FaExclamationCircle, 
  FaClock, 
  FaCheckCircle, 
  FaPaperPlane,
  FaArrowRight
} from "react-icons/fa";

function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Suggestion Form State
  const [suggestionTitle, setSuggestionTitle] = useState("");
  const [suggestionDesc, setSuggestionDesc] = useState("");
  const [suggestionSubmitting, setSuggestionSubmitting] = useState(false);
  const [suggestionSuccess, setSuggestionSuccess] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (currentUser) {
        try {
          const userComplaints = await getUserComplaints(currentUser.uid);
          setComplaints(userComplaints);
        } catch (error) {
          console.error("Error loading dashboard complaints:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDashboardData();
  }, [currentUser]);

  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    if (!suggestionTitle || !suggestionDesc) return;

    setSuggestionSubmitting(true);
    setSuggestionSuccess("");

    try {
      await createSuggestion({
        title: suggestionTitle,
        description: suggestionDesc,
        createdBy: currentUser.uid,
        creatorName: userProfile?.fullName || currentUser.email,
        village: userProfile?.village || ""
      });
      setSuggestionSuccess("Thank you! Your suggestion has been submitted to local authorities.");
      setSuggestionTitle("");
      setSuggestionDesc("");
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      alert("Failed to submit suggestion. Please try again.");
    } finally {
      setSuggestionSubmitting(false);
    }
  };

  const pendingCount = complaints.filter((c) => c.status === "Pending").length;
  const inProgressCount = complaints.filter((c) => c.status === "In Progress" || c.status === "Under Review").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  if (loading) {
    return <LoadingSpinner text="Loading dashboard stats..." />;
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Welcome, {userProfile?.fullName || "Citizen"}</h1>
          <p>
            {userProfile?.village ? `Village: ${userProfile.village}, ${userProfile.taluka || ""} (${userProfile.district || ""})` : currentUser?.email}
          </p>
        </div>
        <div className="banner-actions">
          <Link to="/raise-complaint" className="btn-primary btn-lg">
            <FaPlusCircle /> File New Complaint
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon total">
            <FaListAlt />
          </div>
          <div className="metric-info">
            <h3>{complaints.length}</h3>
            <p>Total Complaints</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon pending">
            <FaClock />
          </div>
          <div className="metric-info">
            <h3>{pendingCount}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon progress">
            <FaExclamationCircle />
          </div>
          <div className="metric-info">
            <h3>{inProgressCount}</h3>
            <p>In Progress / Review</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon resolved">
            <FaCheckCircle />
          </div>
          <div className="metric-info">
            <h3>{resolvedCount}</h3>
            <p>Resolved</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="quick-actions-grid">
        <Link to="/raise-complaint" className="action-card card-hover">
          <div className="action-icon icon-raise">
            <FaPlusCircle />
          </div>
          <div className="action-details">
            <h4>Raise Complaint</h4>
            <p>Report issues regarding water, roads, electricity, sanitation & more.</p>
          </div>
          <FaArrowRight className="action-arrow" />
        </Link>

        <Link to="/my-complaints" className="action-card card-hover">
          <div className="action-icon icon-my-complaints">
            <FaListAlt />
          </div>
          <div className="action-details">
            <h4>My Complaints</h4>
            <p>Track progress and administrative responses for all your grievances.</p>
          </div>
          <FaArrowRight className="action-arrow" />
        </Link>

        <Link to="/profile" className="action-card card-hover">
          <div className="action-icon icon-profile">
            <FaUser />
          </div>
          <div className="action-details">
            <h4>My Profile</h4>
            <p>View & update your contact details, village & location settings.</p>
          </div>
          <FaArrowRight className="action-arrow" />
        </Link>
      </div>

      {/* Recent Complaints Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Grievances</h2>
          <Link to="/my-complaints" className="view-all-link">
            View All ({complaints.length}) <FaArrowRight />
          </Link>
        </div>

        {complaints.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any complaints yet.</p>
            <Link to="/raise-complaint" className="btn-secondary">
              Submit Your First Complaint
            </Link>
          </div>
        ) : (
          <div className="complaints-list-preview">
            {complaints.slice(0, 3).map((item) => (
              <div key={item.id} className="preview-item">
                <div className="item-main">
                  <h4>{item.title}</h4>
                  <div className="item-meta">
                    <span className="meta-category">{item.category}</span>
                    <span>•</span>
                    <span className="meta-date">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="item-status">
                  <StatusBadge status={item.status} />
                  <Link to={`/complaint/${item.id}`} className="btn-sm btn-outline">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Suggestions Section */}
      <div className="dashboard-section suggestions-section">
        <div className="section-header">
          <h2><FaLightbulb /> Submit Community Suggestion</h2>
        </div>
        <p className="suggestion-intro">
          Have an idea to improve infrastructure or services in your village? Send your suggestions directly to local administrators.
        </p>

        {suggestionSuccess && <div className="success-banner">{suggestionSuccess}</div>}

        <form onSubmit={handleSuggestionSubmit} className="suggestion-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Suggestion Title (e.g., Install Solar Streetlights near School)"
              value={suggestionTitle}
              onChange={(e) => setSuggestionTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              rows="3"
              placeholder="Describe your idea or suggestion in detail..."
              value={suggestionDesc}
              onChange={(e) => setSuggestionDesc(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn-secondary" disabled={suggestionSubmitting}>
            {suggestionSubmitting ? "Submitting..." : <><FaPaperPlane /> Submit Suggestion</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;