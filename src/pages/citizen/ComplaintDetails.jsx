import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getComplaintById, getAdminReplies } from "../../services/complaintService";
import StatusBadge from "../../components/common/StatusBadge";
import ComplaintStatus from "./ComplaintStatus";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaComments, FaImage, FaTag, FaExclamationTriangle } from "react-icons/fa";

function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const docData = await getComplaintById(id);
        if (!docData) {
          setError("Complaint not found.");
        } else {
          setComplaint(docData);
          const replyList = await getAdminReplies(id);
          setReplies(replyList);
        }
      } catch (err) {
        console.error("Error fetching complaint details:", err);
        setError("Failed to load complaint details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading complaint details..." />;
  }

  if (error || !complaint) {
    return (
      <div className="page-container">
        <div className="error-banner">{error || "Complaint not found."}</div>
        <Link to="/my-complaints" className="btn-secondary">
          <FaArrowLeft /> Back to My Complaints
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="details-nav">
        <Link to="/my-complaints" className="back-link">
          <FaArrowLeft /> Back to Complaints
        </Link>
      </div>

      <div className="details-header-card">
        <div className="details-title-row">
          <div>
            <span className="category-pill"><FaTag /> {complaint.category}</span>
            <h2>{complaint.title}</h2>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="details-meta-grid">
          <div className="meta-item">
            <FaMapMarkerAlt /> <strong>Village:</strong> {complaint.village}
          </div>
          <div className="meta-item">
            <FaCalendarAlt /> <strong>Filed On:</strong> {new Date(complaint.createdAt).toLocaleString()}
          </div>
          <div className="meta-item">
            <FaUser /> <strong>Submitted By:</strong> {complaint.creatorName}
          </div>
          <div className="meta-item">
            <FaExclamationTriangle /> <strong>Priority:</strong> {complaint.priority || "Medium"}
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <ComplaintStatus currentStatus={complaint.status} />

      {/* Detailed Content */}
      <div className="details-body-grid">
        <div className="details-main-content">
          <div className="content-card">
            <h3>Description of Issue</h3>
            <p className="description-text">{complaint.description}</p>
          </div>

          {complaint.imageUrl && (
            <div className="content-card">
              <h3><FaImage /> Attached Evidence / Photo</h3>
              <div className="evidence-image-container">
                <img src={complaint.imageUrl} alt="Complaint Evidence" className="evidence-img" />
              </div>
            </div>
          )}
        </div>

        {/* Official Admin Communication */}
        <div className="details-side-content">
          <div className="content-card admin-replies-card">
            <h3><FaComments /> Official Response & Updates</h3>

            {replies.length === 0 ? (
              <p className="no-replies-text">
                No official replies posted by local authorities yet. Status updates will appear here.
              </p>
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

export default ComplaintDetails;
