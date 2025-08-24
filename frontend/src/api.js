import axios from 'axios';

const API_URL = 'http://localhost:5000/api/complaint';

export const fileComplaint = (complaintData) => {
  return axios.post(`${API_URL}/file`, complaintData);
};

export const trackComplaint = (complaintId) => {
  return axios.get(`${API_URL}/track/${complaintId}`);
};