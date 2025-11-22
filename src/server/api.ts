import axios from 'axios';

// Para rodar localmente, descomente a linha abaixo e comente a linha seguinte
// const baseURL: string = 'http://localhost:3000';
const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error('A variável VITE_API_BASE_URL não está definida!');
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});