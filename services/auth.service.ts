import http from "../utils/http";
import type { User, AuthResponse, RegisterRequest, UserSummary } from "../types/user";

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const res = await http.post("/auth/register", payload);
  return res.data;
}

export function login(payload: { email: string; password: string }) {
  return http.post("/auth/login", payload);
}


export async function logoutApi(): Promise<void> {
  localStorage.removeItem("token"); 
}
    
export const getProfile = async () => {
  const res = await http.get("/auth/me"); 
  return res.data;
};
export const forgotPassword = async (email: string) => {
  const res = await http.post("/auth/forgot-password", { email });
  return res.data;
};