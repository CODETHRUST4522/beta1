import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserComplaints, CATEGORIES, STATUS_OPTIONS } from "../../services/complaintService";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaSearch, FaFilter, FaPlus, FaEye, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

function MyComplaints() {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const fetchComplaints = async () => {
      if (currentUser) {
        try {
          const list = await getUserComplaints(currentUser.uid);
          setComplaints(list);
          setFilteredComplaints(list);
        } catch (error) {
          console.error("Error fetching complaints:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchComplaints();
  }, [currentUser]);

  useEffect(() => {
    let result = [...complaints];

    if (searchTerm.trim() !== "") {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.village.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (selectedStatus !== "All") {
      result = result.filter((item) => item.status === selectedStatus);
    }

    setFilteredComplaints(result);
  }, [searchTerm, selectedCategory, selectedStatus, complaints]);

  if (loading) {
    return <LoadingSpinner text="Loading your complaints list..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header flex-header">
        <div>
          <h2>My Complaints ({filteredComplaints.length})</h2>
          <p>Track progress and responses for your registered grievances</p>
        </div>
        <Link to="/raise-complaint" className="btn-primary">
          <FaPlus /> New Complaint
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, village, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Cards Grid */}
      {filteredComplaints.length === 0 ? (
        <div className="empty-state card">
          <h3>No Complaints Found</h3>
          <p>
            {complaints.length === 0
              ? "You haven't submitted any complaints yet."
              : "No complaints match your selected search filters."}
          </p>
          {complaints.length === 0 && (
            <Link to="/raise-complaint" className="btn-primary">
              File a Complaint Now
            </Link>
          )}
        </div>
      ) : (
        <div className="complaints-grid">
          {filteredComplaints.map((item) => (
            <div key={item.id} className="complaint-card">
              <div className="card-top">
                <span className="category-tag">{item.category}</span>
                <StatusBadge status={item.status} />
              </div>

              <h3 className="card-title">{item.title}</h3>

              <p className="card-description">
                {item.description.length > 120
                  ? item.description.substring(0, 120) + "..."
                  : item.description}
              </p>

              <div className="card-meta">
                <span><FaMapMarkerAlt /> {item.village}</span>
                <span><FaCalendarAlt /> {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="card-footer">
                <span className={`priority-tag priority-${item.priority?.toLowerCase()}`}>
                  Priority: {item.priority || "Medium"}
                </span>
                <Link to={`/complaint/${item.id}`} className="btn-sm btn-primary">
                  <FaEye /> Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyComplaints;
