import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const baseURL = API_BASE
    ? (API_BASE.endsWith('/api') ? API_BASE : `${API_BASE.replace(/\/$/, '')}/api`)
    : '/api';

const api = axios.create({
    baseURL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
