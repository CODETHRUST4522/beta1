import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  getComplaintById, 
  updateComplaintStatus, 
  addAdminReply, 
  getAdminReplies,
  STATUS_OPTIONS 
} from "../../services/complaintService";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUser, 
  FaPhone, 
  FaComments, 
  FaPaperPlane, 
  FaCheck, 
  FaImage,
  FaShieldAlt
} from "react-icons/fa";

function AdminComplaintDetail() {
  const { id } = useParams();
  const { currentUser, userProfile } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Status & Reply Form state
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState("");

  const [replyMessage, setReplyMessage] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replySuccess, setReplySuccess] = useState("");

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const docData = await getComplaintById(id);
        if (!docData) {
          setError("Complaint record not found.");
        } else {
          setComplaint(docData);
          setSelectedStatus(docData.status || "Pending");
          const replyList = await getAdminReplies(id);
          setReplies(replyList);
        }
      } catch (err) {
        console.error("Error fetching complaint details for admin:", err);
        setError("Failed to load complaint details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdminDetails();
    }
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setStatusSuccess("");
    setStatusUpdating(true);

    try {
      await updateComplaintStatus(id, selectedStatus);
      setComplaint((prev) => ({ ...prev, status: selectedStatus }));
      setStatusSuccess(`Status successfully updated to "${selectedStatus}".`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setReplySuccess("");
    setReplySubmitting(true);

    try {
      const newReply = await addAdminReply(id, {
        adminId: currentUser.uid,
        adminName: userProfile?.fullName || "Administrator",
        message: replyMessage
      });

      setReplies((prev) => [...prev, newReply]);
      setReplyMessage("");
      setReplySuccess("Reply posted successfully.");
    } catch (err) {
      console.error("Error posting admin reply:", err);
      alert("Failed to post reply.");
    } finally {
      setReplySubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading complaint details for processing..." />;
  }

  if (error || !complaint) {
    return (
      <div className="page-container admin-page-container">
        <div className="error-banner">{error || "Complaint not found."}</div>
        <Link to="/admin/complaints" className="btn-secondary">
          <FaArrowLeft /> Return to All Complaints
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container admin-page-container">
      <div className="details-nav">
        <Link to="/admin/complaints" className="back-link">
          <FaArrowLeft /> Back to Complaints List
        </Link>
      </div>

      {/* Admin Action Control Card */}
      <div className="admin-action-card card">
        <div className="action-card-header">
          <h3><FaShieldAlt /> Status Operations</h3>
          <StatusBadge status={complaint.status} />
        </div>

        {statusSuccess && <div className="success-banner"><FaCheck /> {statusSuccess}</div>}

        <form onSubmit={handleStatusUpdate} className="status-update-form">
          <div className="form-group inline-group">
            <label htmlFor="statusSelect">Change Complaint Status:</label>
            <select
              id="statusSelect"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary" disabled={statusUpdating}>
              {statusUpdating ? "Updating..." : "Save Status"}
            </button>
          </div>
        </form>
      </div>

      {/* Complaint Info Header */}
      <div className="details-header-card">
        <div className="details-title-row">
          <div>
            <span className="category-pill">{complaint.category}</span>
            <h2>{complaint.title}</h2>
          </div>
        </div>

        <div className="details-meta-grid">
          <div className="meta-item">
            <FaUser /> <strong>Citizen Name:</strong> {complaint.creatorName || "Citizen"}
          </div>
          {complaint.creatorMobile && (
            <div className="meta-item">
              <FaPhone /> <strong>Contact Mobile:</strong> {complaint.creatorMobile}
            </div>
          )}
          <div className="meta-item">
            <FaMapMarkerAlt /> <strong>Village:</strong> {complaint.village}
          </div>
          <div className="meta-item">
            <FaCalendarAlt /> <strong>Filed On:</strong> {new Date(complaint.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Details & Admin Communication Grid */}
      <div className="details-body-grid">
        <div className="details-main-content">
          <div className="content-card">
            <h3>Grievance Description</h3>
            <p className="description-text">{complaint.description}</p>
          </div>

          {complaint.imageUrl && (
            <div className="content-card">
              <h3><FaImage /> Evidence Image</h3>
              <div className="evidence-image-container">
                <img src={complaint.imageUrl} alt="Complaint Evidence" className="evidence-img" />
              </div>
            </div>
          )}
        </div>

        <div className="details-side-content">
          {/* Add Reply Form */}
          <div className="content-card">
            <h3><FaComments /> Post Official Admin Reply</h3>

            {replySuccess && <div className="success-banner"><FaCheck /> {replySuccess}</div>}

            <form onSubmit={handleReplySubmit} className="admin-reply-form">
              <div className="form-group">
                <textarea
                  rows="4"
                  placeholder="Type official update or response for the citizen..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-admin-action" disabled={replySubmitting}>
                {replySubmitting ? "Posting..." : <><FaPaperPlane /> Post Reply</>}
              </button>
            </form>
          </div>

          {/* Existing Admin Replies */}
          <div className="content-card admin-replies-card">
            <h3>Communication History</h3>
            {replies.length === 0 ? (
              <p className="no-replies-text">No updates posted yet.</p>
            ) : (
              <div className="replies-timeline">
                {replies.map((r) => (
                  <div key={r.id} className="reply-bubble">
                    <div className="reply-header">
                      <strong>{r.adminName || "Administrator"}</strong>
                      <span className="reply-date">
                        {new Date(r.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="reply-message">{r.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminComplaintDetail;
