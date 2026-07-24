import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createComplaint, CATEGORIES } from "../../services/complaintService";
import { FaPaperPlane, FaImage, FaExclamationTriangle, FaList, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";

function RaiseComplaint() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [village, setVillage] = useState(userProfile?.village || "");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB.");
        return;
      }
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !village || !category) {
      setError("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      await createComplaint({
        title,
        category,
        village,
        priority,
        description,
        imageUrl: imagePreview,
        createdBy: currentUser.uid,
        creatorName: userProfile?.fullName || currentUser.email,
        creatorMobile: userProfile?.mobile || ""
      });

      alert("Complaint registered successfully!");
      navigate("/my-complaints");
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setError("Failed to register complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Raise a Grievance / Complaint</h2>
        <p>Provide accurate details to assist local authorities in resolving your issue quickly</p>
      </div>

      <div className="form-card">
        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label htmlFor="title"><FaFileAlt /> Issue Title *</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Broken Water Pipeline in Ward 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category"><FaList /> Category *</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority"><FaExclamationTriangle /> Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="village"><FaMapMarkerAlt /> Village / Location *</label>
            <input
              id="village"
              type="text"
              placeholder="Village Name"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              rows="5"
              placeholder="Describe the problem, exact location landmark, and impact..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label><FaImage /> Attach Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Complaint Preview" className="uploaded-preview" />
                <button
                  type="button"
                  className="btn-sm btn-danger"
                  onClick={() => setImagePreview("")}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary btn-lg" disabled={submitting}>
              {submitting ? "Registering Complaint..." : <><FaPaperPlane /> Submit Complaint</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RaiseComplaint;
