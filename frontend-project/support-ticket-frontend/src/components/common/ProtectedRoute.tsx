// src/components/common/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: Array<'CLIENT' | 'SUPPORT' | 'ADMIN'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // If user is authenticated but does not have the required role
    // Redirect to a "Forbidden" page or dashboard (or show an inline message)
    // For simplicity, redirecting to dashboard, but a dedicated /forbidden page is better UX.
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
    // Or: return <p>You do not have permission to access this page.</p>;
  }

  return <Outlet />; // Render child route element
};

export default ProtectedRoute;
