import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
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
      logout();
    }
    setLoading(false);
  }, []);

  /**
   * Student Login
   */
  const studentLogin = async (userName, password) => {
    try {
      const response = await api.post('/student/login', {
        userName,
        password
      });

      // Handle different response formats
      let jwtToken;
      if (typeof response.data === 'string') {
        // If response is a string like "Login successful", extract token from headers or response
        jwtToken = response.data.token || response.headers?.authorization?.replace('Bearer ', '');
      } else {
        jwtToken = response.data.token || response.data;
      }

      if (!jwtToken) {
        throw new Error('Token not received from server');
      }

      // Decode token to get role and email
      const decodedRole = getRoleFromToken(jwtToken);
      const email = getEmailFromToken(jwtToken);

      // Store token and user info
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setRole(decodedRole);

      // Get student ID from response or extract from email via API
      let studentId = response.data.studentId;

      if (!studentId && decodedRole === 'STUDENT') {
        try {
          const studentProfile = await api.get(`/student/email/${email}`);
          studentId = studentProfile.data.studentId;
          // Also store name for sidebar
          if (studentProfile.data.name) {
            localStorage.setItem('name', studentProfile.data.name);
          }
        } catch (e) {
          console.warn('Could not fetch student profile after login:', e);
        }
      }

      if (studentId && studentId !== 'undefined' && studentId !== 'null') {
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
      throw error.response?.data || error.message || 'Login failed';
    }
  };

  /**
   * Admin Login
   */
  const adminLogin = async (userName, password) => {
    try {
      const response = await api.post('/admin/login', {
        userName,
        password
      });

      // Handle different response formats
      let jwtToken;
      if (typeof response.data === 'string') {
        // If response is a string, check headers first
        jwtToken = response.headers?.authorization?.replace('Bearer ', '') || null;
        if (!jwtToken) {
          // Try to extract from response string if it's JSON stringified
          try {
            const parsed = JSON.parse(response.data);
            jwtToken = parsed.token;
          } catch (e) {
            // If not JSON, might be plain text - check headers
            jwtToken = response.headers?.authorization?.replace('Bearer ', '');
          }
        }
      } else {
        // Response is an object
        jwtToken = response.data.token || response.data;
      }

      if (!jwtToken || jwtToken === 'undefined' || jwtToken === 'null') {
        throw new Error('Token not received from server');
      }

      // Decode token to get role and email
      const decodedRole = getRoleFromToken(jwtToken);
      const email = getEmailFromToken(jwtToken);

      // Store token and user info
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
      throw error.response?.data || error.message || 'Login failed';
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('isAdmin');
    setToken(null);
    setRole(null);
    setUser(null);
    navigate('/login');
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    if (!token) return false;
    if (isTokenExpired(token)) {
      logout();
      return false;
    }
    return true;
  };

  /**
   * Check if user has specific role
   */
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
