import axios from 'axios';

// Instancia global de Axios conectada al backend local (Uvicorn)
export const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
