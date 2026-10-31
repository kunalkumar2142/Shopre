import type { SignInRequest, SignUpRequest } from "@/types/auth";
import type {
  AddToCartRequest,
  ApiProduct,
  ApiProductResponse,
  CartResponse,
} from "@/types/product";
import type { Order, PlaceOrderRequest } from "@/types/order";
import type { UserProfile } from "@/types/user";
import axios from "axios";

/** API gateway — use for all browser requests (CORS + routing). */
const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:8081";

const api = axios.create({ baseURL: API_BASE_URL });

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const getStoredUserId = (): string | undefined => {
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

    const parsed = JSON.parse(storedSession) as { token?: string };
    const token = parsed.token;
    if (!token) return undefined;

    const payload = decodeJwtPayload(token);
    if (!payload) return undefined;
    const val = (payload.userId ?? payload.id ?? payload.sub) as string | undefined;
    return typeof val === "string" ? val : undefined;
  } catch {
    return undefined;
  }
};

api.interceptors.request.use((config) => {
  if (config.url?.startsWith("/api/v1/auth")) {
    return config;
  }

  try {
    const stored = localStorage.getItem("userSession");
    if (stored) {
      const parsed = JSON.parse(stored) as { token?: string };
      const token = parsed.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore malformed session — let request proceed unauthenticated
  }

  if (
    config.url?.startsWith("/api/v1/cart") ||
    config.url?.startsWith("/api/v1/orders")
  ) {
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

export const placeOrder = (request: PlaceOrderRequest) =>
  api.post<Order>("/api/v1/orders", request);

export const getOrders = () => api.get<Order[]>("/api/v1/orders");

export const getOrderById = (id: string) =>
  api.get<Order>(`/api/v1/orders/${id}`);

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
    const data = error.response?.data as { message?: string } | string | undefined;
    const msg =
      typeof data === "string" ? data : data && typeof data === "object" ? data.message : "";
    const lower = msg?.toLowerCase() ?? "";
    if (lower.includes("already exists") || lower.includes("duplicate") || lower.includes("unique")) {
      return "An account with this email already exists.";
    }
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
