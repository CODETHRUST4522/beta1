import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllComplaints, CATEGORIES } from "../../services/complaintService";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { 
  FaShieldAlt, 
  FaListAlt, 
  FaClock, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaArrowRight, 
  FaChartPie,
  FaMapMarkerAlt
} from "react-icons/fa";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const list = await getAllComplaints();
        setComplaints(list);
      } catch (error) {
        console.error("Error fetching all complaints for admin:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const pendingCount = complaints.filter((c) => c.status === "Pending").length;
  const reviewCount = complaints.filter((c) => c.status === "Under Review").length;
  const progressCount = complaints.filter((c) => c.status === "In Progress").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  if (loading) {
    return <LoadingSpinner text="Loading administrative dashboard..." />;
  }

  return (
    <div className="dashboard-container admin-dashboard-theme">
      <div className="welcome-banner admin-banner">
        <div className="welcome-text">
          <h1><FaShieldAlt /> Administrator Command Portal</h1>
          <p>GramSeva Rural Grievance Redressal & Status Operations</p>
        </div>
        <div className="banner-actions">
          <Link to="/admin/complaints" className="btn-admin-action btn-lg">
            <FaListAlt /> Manage All Complaints ({complaints.length})
          </Link>
        </div>
      </div>

      {/* Admin Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon total">
            <FaListAlt />
          </div>
          <div className="metric-info">
            <h3>{complaints.length}</h3>
            <p>Total Registered</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon pending">
            <FaClock />
          </div>
          <div className="metric-info">
            <h3>{pendingCount}</h3>
            <p>Pending Action</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon progress">
            <FaExclamationCircle />
          </div>
          <div className="metric-info">
            <h3>{reviewCount + progressCount}</h3>
            <p>Under Review / In Progress</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon resolved">
            <FaCheckCircle />
          </div>
          <div className="metric-info">
            <h3>{resolvedCount}</h3>
            <p>Successfully Resolved</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Recent Submissions Grid */}
      <div className="admin-two-col">
        {/* Category Breakdown */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2><FaChartPie /> Grievances by Category</h2>
          </div>
          <div className="category-stats-list">
            {CATEGORIES.map((cat) => {
              const catCount = complaints.filter((c) => c.category === cat).length;
              const percentage = complaints.length > 0 ? Math.round((catCount / complaints.length) * 100) : 0;
              return (
                <div key={cat} className="category-stat-item">
                  <div className="stat-label">
                    <span>{cat}</span>
                    <strong>{catCount} ({percentage}%)</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Urgent Complaints */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Pending Complaints</h2>
            <Link to="/admin/complaints" className="view-all-link">
              View All <FaArrowRight />
            </Link>
          </div>

          {pendingCount === 0 ? (
            <div className="empty-state">
              <p>No pending complaints requiring action!</p>
            </div>
          ) : (
            <div className="admin-complaints-list-preview">
              {complaints
                .filter((c) => c.status === "Pending")
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="admin-preview-item">
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p className="item-meta">
                        <span><FaMapMarkerAlt /> {item.village}</span> • <span>Category: {item.category}</span>
                      </p>
                    </div>
                    <div className="item-action">
                      <StatusBadge status={item.status} />
                      <Link to={`/admin/complaint/${item.id}`} className="btn-sm btn-admin">
                        Process
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
