import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/**
 * ProtectedRoute — wraps routes that require authentication.
 * Optionally restricts to a specific role.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/donor/dashboard" element={<DonorDashboard />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute role="DONOR" />}>
 *     ...
 *   </Route>
 */
import { Outlet } from 'react-router-dom';

export default function ProtectedRoute({ role }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show nothing while restoring session from localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in — redirect to login, preserve intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role
  if (role && user?.role?.toUpperCase() !== role.toUpperCase()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
