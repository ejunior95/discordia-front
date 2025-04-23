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
