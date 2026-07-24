import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/auth/AdminLogin";

// Citizen Pages
import Dashboard from "./pages/citizen/Dashboard";
import Profile from "./pages/citizen/Profile";
import RaiseComplaint from "./pages/citizen/RaiseComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import ComplaintDetails from "./pages/citizen/ComplaintDetails";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminComplaintDetail from "./pages/admin/AdminComplaintDetail";

// Shared Pages
import NotFound from "./pages/shared/NotFound";

function App() {
  return (
    <AuthProvider>
      <div className="app-layout">
        <Navbar />
        <main className="main-content-area">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Citizen Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/raise-complaint"
              element={
                <ProtectedRoute>
                  <RaiseComplaint />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-complaints"
              element={
                <ProtectedRoute>
                  <MyComplaints />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaint/:id"
              element={
                <ProtectedRoute>
                  <ComplaintDetails />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/complaints"
              element={
                <AdminRoute>
                  <AdminComplaints />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/complaint/:id"
              element={
                <AdminRoute>
                  <AdminComplaintDetail />
                </AdminRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;