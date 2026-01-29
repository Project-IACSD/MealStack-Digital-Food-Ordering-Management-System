import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!isAuthenticated()) {
        // Redirect to login page, but save the current location if needed
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        // Redirect to unauthorized page or dashboard if role doesn't match
        // For now, redirect to login or home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
