


import axios from 'axios';

// Backend server ka live URL
const API_URL = 'https://civictrack-server.onrender.com/api/complaint';

/**
 * Backend ko ek nayi complaint file karne ke liye request bhejta hai.
 * @param {object} complaintData - Form ka data.
 * @returns {Promise} - Axios ka promise object.
 */
export const fileComplaint = (complaintData) => {
  return axios.post(`${API_URL}/file`, complaintData);
};

/**
 * Di gayi ID ke liye complaint details fetch karta hai.
 * @param {string} complaintId - Track ki jaane wali ID.
 * @returns {Promise} - Axios ka promise object.
 */
export const trackComplaint = (complaintId) => {
  return axios.get(`${API_URL}/track/${complaintId}`);
};