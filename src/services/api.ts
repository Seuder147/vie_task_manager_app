import axios from 'axios';

const getBaseUrl = () => {
  // If explicitly set in env, use it (e.g. for production)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Otherwise, assume the API is on the same host as the frontend but port 3000
  // This works dynamically for localhost, 192.168.x.x, 193.170.x.x, etc.
  return `http://${window.location.hostname}:3000`;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
