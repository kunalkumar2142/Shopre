import type { SignInRequest, SignUpRequest } from "@/types/auth";
import type { UserProfile } from "@/types/user";
import axios from "axios";

/** API gateway — use for all browser requests (CORS + routing). */
const API_BASE_URL = "http://localhost:8081";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  if (config.url?.startsWith("/api/v1/auth")) {
    return config;
  }
  const stored = localStorage.getItem("userSession");
  if (stored) {
    const { token } = JSON.parse(stored) as { token: string };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const signIn = (signInRequest: SignInRequest) =>
  api.post<{ token: string }>("/api/v1/auth/login", signInRequest);

export const signUp = (signUpRequest: SignUpRequest) =>
  api.post<{ token: string }>("/api/v1/auth/signup", signUpRequest);

export const getCurrentUser = () =>
  api.get<UserProfile>("/api/v1/users/me");

export function getAuthErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | string | undefined;
    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object" && data.message) return data.message;
    if (error.response?.status === 401) return "Invalid email or password.";
    if (error.response?.status === 409) return "An account with this email already exists.";
    if (error.response?.status && error.response.status >= 500) {
      return "Server error. Please try again later.";
    }
    return error.message || "Something went wrong. Please try again.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
