import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

api.interceptors.response.use((response) => response, error => {
  if (error.response.status !== 401) {
    return error;
  }

  window.location.reload();
});

export default api;
