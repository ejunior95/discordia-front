import axios from 'axios';
import { toast } from 'sonner';

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

const PUBLIC_PATHS = ['/', '/login', '/register', '/auth/verify-email'];

/**
 * Callback registrado pelo AuthContext para receber o saldo de créditos
 * enviado pelo backend no header `X-Credits-Balance` (number | 'unlimited').
 * Permite atualizar a navbar sem polling.
 */
let creditsListener: ((balance: number | 'unlimited') => void) | null = null;
export function registerCreditsListener(
  fn: ((balance: number | 'unlimited') => void) | null,
) {
  creditsListener = fn;
}

api.interceptors.response.use(
  (response) => {
    const header = response.headers?.['x-credits-balance'];
    if (header != null && creditsListener) {
      if (header === 'unlimited') creditsListener('unlimited');
      else {
        const parsed = Number(header);
        if (!Number.isNaN(parsed)) creditsListener(parsed);
      }
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code as string | undefined;
    const currentPath = window.location.pathname;
    const isAuthEndpoint = typeof error?.config?.url === 'string' && error.config.url.includes('/auth/me');

    if (status === 401 && !PUBLIC_PATHS.includes(currentPath) && !isAuthEndpoint) {
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (status === 402 && code === 'INSUFFICIENT_CREDITS') {
      const data = error.response.data;
      try {
        toast.error('Créditos insuficientes', {
          description: `Você precisa de ${data.required} créditos. Saldo atual: ${data.balance}.`,
          action: {
            label: 'Upgrade',
            onClick: () => (window.location.href = '/subscription'),
          },
        });
      } catch {
        // sonner pode não estar montado em testes
      }
    }

    if (status === 403 && code === 'FEATURE_NOT_ALLOWED') {
      const data = error.response.data;
      try {
        toast.error('Recurso indisponível no seu plano', {
          description: `Capacidade exigida: ${data.capability}. Faça upgrade para liberar.`,
          action: {
            label: 'Ver planos',
            onClick: () => (window.location.href = '/subscription'),
          },
        });
      } catch {
        // ignore
      }
    }

    return Promise.reject(error);
  }
);