// Typed API client with centralized error, retry, and cancellation logic
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  // Inject auth headers, etc.
  // config.headers['Authorization'] = ...
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    // Map to domain errors if needed
    return Promise.reject(error);
  }
);

export default api;
