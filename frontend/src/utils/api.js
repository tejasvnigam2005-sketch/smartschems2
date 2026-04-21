import axios from 'axios';

// API base URL
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
export const getEligibility = (data) => API.post('/recommend/eligibility', data);

// Scheme APIs
export const getBusinessSchemes = (params) => API.get('/business-schemes', { params });
export const getEducationSchemes = (params) => API.get('/education-schemes', { params });

// Auth APIs
export const login = (data) => API.post('/auth/login', data);
export const signup = (data) => API.post('/auth/signup', data);
export const getMe = () => API.get('/auth/me');

// Scheme Guide APIs
export const getDocumentChecklist = (schemeType, schemeId) => API.get(`/scheme-guide/documents/${schemeType}/${schemeId}`);
export const getApplicationGuide = (schemeType, schemeId) => API.get(`/scheme-guide/steps/${schemeType}/${schemeId}`);

export default API;
