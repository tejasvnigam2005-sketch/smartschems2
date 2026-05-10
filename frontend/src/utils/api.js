// Centralized API client — all fetch() calls go through this module.
// Uses axios with auth interceptor and standardized error handling.

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const API = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: true,
});

// Response interceptor — handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

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
export const getDocumentChecklist = (schemeType, schemeId) =>
  API.get(`/scheme-guide/documents/${schemeType}/${schemeId}`);
export const getApplicationGuide = (schemeType, schemeId) =>
  API.get(`/scheme-guide/steps/${schemeType}/${schemeId}`);

export default API;
