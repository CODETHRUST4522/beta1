import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!userProfile || userProfile.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
