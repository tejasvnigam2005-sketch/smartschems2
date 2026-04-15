import axios from 'axios';

// In dev, Vite proxy handles /api → localhost:5000
// In prod, VITE_API_URL points to the Vercel backend
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const API = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Auth interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartschemes_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Recommendation API
export const getRecommendations = (data) => API.post('/recommend', data);

// Scheme APIs
export const getBusinessSchemes = (params) => API.get('/business-schemes', { params });
export const getEducationSchemes = (params) => API.get('/education-schemes', { params });

// Auth APIs
export const login = (data) => API.post('/auth/login', data);
export const signup = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

export default API;
