import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  analyzeLogs: async (logs) => {
    const response = await apiClient.post('/logs/analyze-logs', logs);
    return response.data;
  },
  // Add more methods for other API interactions as needed
}; 