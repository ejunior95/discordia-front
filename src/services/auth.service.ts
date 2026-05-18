import { api } from "@/server/api";

export async function login(email: string, password: string) {
  await api.post("/auth/login", { email, password });
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function getUserInfo() {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch(error) {
    console.error(error)
    return null;
  }
}

/**
 * Confirma o cadastro via código OTP enviado por email.
 * O backend já seta o cookie `access_token` em caso de sucesso.
 * Retorna o usuário autenticado (id, name, email, avatar).
 */
export async function verifyEmail(email: string, code: string) {
  const res = await api.post("/auth/verify-email", { email, code });
  return res.data;
}

/**
 * Solicita o reenvio do código de verificação.
 * Resposta é genérica — backend aplica cooldown de 60s.
 */
export async function resendVerification(email: string) {
  await api.post("/auth/resend-verification", { email });
}

