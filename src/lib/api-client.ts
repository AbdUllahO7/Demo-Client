// src/lib/api-client.ts
// If you don't need to send cookies/credentials, remove withCredentials

import axios, { AxiosError, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

const apiClient = axios.create({
  baseURL: `${API_URL}/api/${API_VERSION}`,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
 
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
  
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default apiClient;