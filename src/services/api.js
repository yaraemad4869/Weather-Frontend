import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7007/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - No authentication since API doesn't require it
api.interceptors.request.use(
  (config) => {
    // No token logic since API has no authorization
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      toast.error('Too many requests. Please wait a moment.');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.status === 404) {
      // Don't show error for 404, let components handle it
      return Promise.reject(error);
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message === 'Network Error') {
      toast.error('Network error. Please check if the API is running on port 7007');
    } else {
      toast.error('An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
);

export default api;