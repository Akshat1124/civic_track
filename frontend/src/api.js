// frontend/src/api.js (Final Code)

import axios from 'axios';

// Backend ka base URL
const API_BASE_URL = 'https://civictrack-server.onrender.com';

// --- Complaint API Calls ---
export const fileComplaint = (complaintData) => {
  return axios.post(`${API_BASE_URL}/api/complaint/file`, complaintData);
};

export const trackComplaint = (complaintId) => {
  return axios.get(`${API_BASE_URL}/api/complaint/track/${complaintId}`);
};

// --- Auth API Calls ---
export const loginUser = (credentials) => {
  return axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
};

export const registerUser = (userData) => {
  return axios.post(`${API_BASE_URL}/api/auth/register`, userData);
};