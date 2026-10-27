import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 
    'Content-Type': 'application/json'
  }
});

// Ajouter le token JWT automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (email, password) =>
  api.post('/users/login', { email, password });

export const register = (username, email, password, extra = {}) =>
  api.post('/users/register', { username, email, password, ...extra });
  

export default api;// Wed Jul 29 12:51:01 +01 2026
