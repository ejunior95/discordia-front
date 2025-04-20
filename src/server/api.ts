import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL_LOCAL;
if (!baseURL) {
  throw new Error('A variável VITE_API_BASE_URL_LOCAL não está definida!');
}

export const api = axios.create({ baseURL });