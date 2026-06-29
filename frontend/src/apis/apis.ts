import type { SignInRequest, SignUpRequest } from "@/types/auth";
import type {
  AddToCartRequest,
  ApiProduct,
  ApiProductResponse,
  CartResponse,
} from "@/types/product";
import type { UserProfile } from "@/types/user";
import axios from "axios";

/** API gateway — use for all browser requests (CORS + routing). */
const API_BASE_URL = "http://localhost:8081";

const api = axios.create({ baseURL: API_BASE_URL });

const getStoredUserId = () => {
  try {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser) as UserProfile;
      if (user.id) return user.id;
    }
  } catch {
    // ignore malformed stored user data
  }

  try {
    const storedSession = localStorage.getItem("userSession");
    if (!storedSession) return undefined;

    const { token } = JSON.parse(storedSession) as { token?: string };
    if (!token) return undefined;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || payload.id || payload.sub;
  } catch {
    return undefined;
  }
};

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

  if (config.url?.startsWith("/api/v1/cart")) {
    const userId = getStoredUserId();
    if (userId) {
      config.headers["X-USER-ID"] = userId;
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

export const getProducts = () =>
  api.get<ApiProductResponse>("/api/v1/products");

export const getProductById = (id: string) =>
  api.get<ApiProductResponse>(`/api/v1/products/${id}`);

export const getProductBySlug = (slug: string) =>
  api.get<ApiProductResponse>(`/api/v1/products/slug/${slug}`);

export const addToCart = (request: AddToCartRequest) =>
  api.post<{ message: string; cartId: string }>("/api/v1/cart", request);

export const getCart = () => api.get<CartResponse>("/api/v1/cart");

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | string | undefined;
    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object" && data.message) return data.message;
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function getAuthErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return "Invalid email or password.";
    if (error.response?.status === 409) return "An account with this email already exists.";
    if (error.response?.status && error.response.status >= 500) {
      return "Server error. Please try again later.";
    }
  }
  return getApiErrorMessage(error, "Something went wrong. Please try again.");
}

export function parseProductsResponse(data: ApiProductResponse): ApiProduct[] {
  if (!data.data) return [];
  return Array.isArray(data.data) ? data.data : [data.data];
}
