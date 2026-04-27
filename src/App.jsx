import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerPage from "./pages/OrganizerPage";
import ForgotPassword from "./pages/ForgotPassword";
import StaffPage from "./pages/StaffPage";

function AuthRedirect() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token && user) {
      const scopes = user.scope ? user.scope.split(' ') : [];
      if (scopes.includes('ROLE_ADMIN')) {
        navigate('/admin', { replace: true });
      } else if (scopes.includes('ROLE_ORGANIZER')) {
        navigate('/organizer', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [token, user, navigate]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthRedirect />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/organizer" element={<OrganizerPage />} />
          <Route path="/staff" element={<StaffPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;