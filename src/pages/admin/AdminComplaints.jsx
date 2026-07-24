import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllComplaints, CATEGORIES, STATUS_OPTIONS } from "../../services/complaintService";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaSearch, FaFilter, FaEye, FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const list = await getAllComplaints();
        setComplaints(list);
        setFilteredComplaints(list);
      } catch (error) {
        console.error("Error fetching all complaints:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    let result = [...complaints];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.village.toLowerCase().includes(term) ||
          (item.creatorName && item.creatorName.toLowerCase().includes(term)) ||
          item.description.toLowerCase().includes(term)
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
    return <LoadingSpinner text="Loading all complaints for management..." />;
  }

  return (
    <div className="page-container admin-page-container">
      <div className="page-header flex-header">
        <div>
          <h2>All Grievances Management ({filteredComplaints.length})</h2>
          <p>Search, filter, and process rural complaints submitted across all villages</p>
        </div>
      </div>

      {/* Admin Filter Controls */}
      <div className="filter-bar admin-filter-bar">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, village, citizen name..."
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

      {/* Administrative Complaints Table */}
      {filteredComplaints.length === 0 ? (
        <div className="empty-state card">
          <h3>No Complaints Match Search Criteria</h3>
          <p>Try resetting search terms or filters.</p>
        </div>
      ) : (
        <div className="table-responsive card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title / Category</th>
                <th>Village</th>
                <th>Citizen</th>
                <th>Filed Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="table-title">{item.title}</div>
                    <span className="category-pill-sm">{item.category}</span>
                  </td>
                  <td><FaMapMarkerAlt className="text-icon" /> {item.village}</td>
                  <td><FaUser className="text-icon" /> {item.creatorName || "Citizen"}</td>
                  <td><FaCalendarAlt className="text-icon" /> {new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`priority-tag priority-${item.priority?.toLowerCase()}`}>
                      {item.priority || "Medium"}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td>
                    <Link to={`/admin/complaint/${item.id}`} className="btn-sm btn-admin">
                      <FaEye /> Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminComplaints;
