import axios from 'axios';

const API_BASE_URL = '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Jewelry business API functions
export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await api.get('/api/products');
    return response.data;
  } catch (error) {
    console.error('Get products failed:', error);
    throw error;
  }
};

export const getMetalRates = async () => {
  try {
    const response = await api.get('/api/rates');
    return response.data;
  } catch (error) {
    console.error('Get rates failed:', error);
    throw error;
  }
};
