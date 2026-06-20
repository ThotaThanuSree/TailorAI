import axios from 'axios';

// Base URL points to our Spring Boot backend
const API_BASE_URL = 'https://tailorai-hpc9.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication Service
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data && response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },
  getProfile: async (userId) => {
    const response = await api.get(`/auth/profile/${userId}`);
    return response.data;
  }
};

// Measurements Service
export const measurementService = {
  saveMeasurements: async (measurementData) => {
    const response = await api.post('/measurements', measurementData);
    return response.data;
  },
  getLatestMeasurements: async (userId) => {
    const response = await api.get(`/measurements/${userId}`);
    return response.data;
  },
  getMeasurementHistory: async (userId) => {
    const response = await api.get(`/measurements/${userId}/history`);
    return response.data;
  }
};

// Photo Upload Service
export const photoService = {
  uploadPhoto: async (file, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    const response = await api.post('/upload/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Fabrics Service
export const fabricService = {
  getFabrics: async () => {
    const response = await api.get('/fabrics');
    return response.data;
  },
  createFabric: async (fabricData) => {
    const response = await api.post('/fabrics', fabricData);
    return response.data;
  },
  updateFabric: async (id, fabricData) => {
    const response = await api.put(`/fabrics/${id}`, fabricData);
    return response.data;
  },
  deleteFabric: async (id) => {
    const response = await api.delete(`/fabrics/${id}`);
    return response.data;
  }
};

// Recommendations Service
export const recommendationService = {
  generateRecommendation: async (data) => {
    const response = await api.post('/recommendations/generate', data);
    return response.data;
  },
  getRecommendationHistory: async (userId) => {
    const response = await api.get(`/recommendations/history/${userId}`);
    return response.data;
  }
};

// Patterns Service
export const patternService = {
  generatePattern: async (data) => {
    const response = await api.post('/patterns/generate', data);
    return response.data;
  },
  getPatternHistory: async (userId) => {
    const response = await api.get(`/patterns/history/${userId}`);
    return response.data;
  }
};

export default api;
