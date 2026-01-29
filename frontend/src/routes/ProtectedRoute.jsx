import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { token, role } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard if role mismatch, or a forbidden page
        if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
        if (role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
