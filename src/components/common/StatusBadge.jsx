import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusClass = (statusStr) => {
    switch (statusStr) {
      case "Pending":
        return "badge badge-pending";
      case "Under Review":
        return "badge badge-review";
      case "In Progress":
        return "badge badge-progress";
      case "Resolved":
        return "badge badge-resolved";
      default:
        return "badge badge-default";
    }
  };

  return <span className={getStatusClass(status)}>{status || "Pending"}</span>;
};

export default StatusBadge;
