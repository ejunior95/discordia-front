import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error('A variável VITE_API_BASE_URL não está definida!');
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});