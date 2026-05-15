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

const PUBLIC_PATHS = ['/', '/login', '/register'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const currentPath = window.location.pathname;
    const isAuthEndpoint = typeof error?.config?.url === 'string' && error.config.url.includes('/auth/me');

    if (status === 401 && !PUBLIC_PATHS.includes(currentPath) && !isAuthEndpoint) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);