import axios from 'axios';

// Create axios instance
// In development, use Vite proxy (empty baseURL)
// In production, use the backend URL from environment variable
const api = axios.create({
    baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL : '',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // IMPORTANT: Diagnostic log for 403 debugging
            console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
                hasAuth: !!config.headers.Authorization,
                tokenPrefix: config.headers.Authorization.substring(0, 15) + "..."
            });
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Response interceptor for API calls
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear storage and redirect to login
            localStorage.clear();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
