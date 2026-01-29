import axios from 'axios';
import { isTokenExpired } from '../utils/jwtUtils';

// Centralized API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add JWT token to Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        // Add JWT token to Authorization header
        if (token && !isTokenExpired(token)) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Also add student ID header if available (for backward compatibility)
        const studentId = localStorage.getItem('studentId');
        if (studentId) {
            config.headers['X-Student-Id'] = studentId;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('API Error:', error.response.data);
            
            // Handle 401 Unauthorized - token expired or invalid
            if (error.response.status === 401) {
                // Clear all auth data
                localStorage.removeItem('token');
                localStorage.removeItem('studentId');
                localStorage.removeItem('studentEmail');
                localStorage.removeItem('isAdmin');
                
                // Redirect to login if not already there
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        } else if (error.request) {
            console.error('Network Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
export { API_BASE_URL };