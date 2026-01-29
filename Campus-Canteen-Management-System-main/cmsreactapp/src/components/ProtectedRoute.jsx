import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and role
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @param {string} props.requiredRole - Required role (STUDENT or ADMIN)
 * @param {string} props.redirectTo - Path to redirect if unauthorized (default: /login)
 */
const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required role
  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect based on role
    if (hasRole('ADMIN')) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (hasRole('STUDENT')) {
      return <Navigate to="/student/dashboard" replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated and has required role
  return children;
};

export default ProtectedRoute;
