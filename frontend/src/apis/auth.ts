import type { SignInRequest } from "@/types/auth";
import type { Usersession } from "@/types/user-session";

interface SignInResponse {
  data: Usersession;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export async function signIn(
  payload: SignInRequest,
): Promise<SignInResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to sign in");
  }

  const data = (await response.json()) as Usersession;

  return { data };
}

