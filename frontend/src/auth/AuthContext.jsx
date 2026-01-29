import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import api from '../api/axios'; // Still needed for profile fetching if not in authService
import { decodeToken, getRoleFromToken, getEmailFromToken, isTokenExpired } from '../utils/jwtUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken && !isTokenExpired(storedToken)) {
            const decodedRole = getRoleFromToken(storedToken);
            const email = getEmailFromToken(storedToken);
            const studentId = localStorage.getItem('studentId');

            setToken(storedToken);
            setRole(decodedRole);
            setUser({
                email,
                studentId,
                role: decodedRole
            });
        } else {
            // Token expired or invalid, clear storage
            // Do not call logout() here to avoid redirect loop or navigation outside context check
            localStorage.removeItem('token');
            localStorage.removeItem('studentId');
            setToken(null);
            setRole(null);
            setUser(null);
        }
        setLoading(false);
    }, []);

    /**
     * Student Login
     */
    const studentLogin = async (userName, password) => {
        try {
            const response = await authService.studentLogin(userName, password);

            // Handle different response formats (adapted from previous logic)
            let jwtToken;
            if (typeof response === 'string') {
                // In case service returned string (unlikely with new service, but safe to keep)
                jwtToken = response;
            } else {
                jwtToken = response.token || response;
            }

            if (!jwtToken || typeof jwtToken !== 'string') {
                // Fallback: check localStorage if service set it (it shouldn't)
                // or check if response has token in header (axios interceptor logic)
                // With new service returning response.data, if token was in header, we might miss it unless service handles it.
                // Re-checking authService implementation: it returns response.data.
                // If backend returns token in Body, we are good.
                // If backend returns token in Header ONLY, authService needs update.
                // Assuming backend returns in Body based on previous code.
                throw new Error('Token not received from server');
            }

            // Decode token
            const decodedRole = getRoleFromToken(jwtToken);
            const email = getEmailFromToken(jwtToken);

            // Store
            localStorage.setItem('token', jwtToken);
            setToken(jwtToken);
            setRole(decodedRole);

            // Get student ID
            let studentId = response.studentId;

            if (!studentId && decodedRole === 'STUDENT') {
                try {
                    // This API call should probably be in studentService but ok here for now
                    const studentProfile = await api.get(`/student/email/${email}`);
                    studentId = studentProfile.data.studentId;
                    if (studentProfile.data.name) {
                        localStorage.setItem('name', studentProfile.data.name);
                    }
                } catch (e) {
                    console.warn('Could not fetch student profile after login:', e);
                }
            }

            if (studentId) {
                localStorage.setItem('studentId', studentId);
            }

            setUser({
                email,
                studentId,
                role: decodedRole
            });

            return { success: true, role: decodedRole };
        } catch (error) {
            console.error('Student login error:', error);
            throw error;
        }
    };

    /**
     * Admin Login
     */
    const adminLogin = async (userName, password) => {
        try {
            const response = await authService.adminLogin(userName, password);

            let jwtToken = response.token || response;

            if (!jwtToken) {
                throw new Error('Token not received from server');
            }

            const decodedRole = getRoleFromToken(jwtToken);
            const email = getEmailFromToken(jwtToken);

            localStorage.setItem('token', jwtToken);
            setToken(jwtToken);
            setRole(decodedRole);

            setUser({
                email,
                role: decodedRole
            });

            return { success: true, role: decodedRole };
        } catch (error) {
            console.error('Admin login error:', error);
            throw error;
        }
    };

    /**
     * Logout
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('studentId');
        localStorage.removeItem('studentEmail');
        localStorage.removeItem('name');
        setToken(null);
        setRole(null);
        setUser(null);
        navigate('/login');
    };

    const isAuthenticated = () => {
        if (!token) return false;
        if (isTokenExpired(token)) {
            logout();
            return false;
        }
        return true;
    };

    const hasRole = (requiredRole) => {
        return role === requiredRole;
    };

    const value = {
        user,
        token,
        role,
        loading,
        studentLogin,
        adminLogin,
        logout,
        isAuthenticated,
        hasRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
