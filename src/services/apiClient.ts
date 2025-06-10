// Cliente Axios centralizado para toda la app
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL
  // withCredentials eliminado para evitar problemas CORS
});

export default apiClient;
