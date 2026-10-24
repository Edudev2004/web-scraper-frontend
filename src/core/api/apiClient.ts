import axios from 'axios';

// Instancia global de Axios conectada a la variable de entorno o al backend local (Uvicorn)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

