import axios from 'axios';

const BASE_URL = '/api/v1';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

// Attach JWT token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 — redirect to login
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('auth-storage');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
