import type { SignInRequest, SignUpRequest } from "@/types/auth";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8081" });

export const signIn = (signInRequest: SignInRequest) =>
  api.post("/api/v1/auth/login", signInRequest);

export const signUp = (signUpRequest: SignUpRequest) =>
  api.post("/api/v1/auth/signup", signUpRequest);

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