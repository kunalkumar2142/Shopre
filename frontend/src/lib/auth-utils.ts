const decodePayload = (token: string): Record<string, unknown> | null => {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)) as Record<string, unknown>;
  } catch {
    return null;
  }
};

export function getEmailFromToken(token: string): string | null {
  const payload = decodePayload(token);
  if (!payload) return null;
  const sub = payload.sub as string | undefined;
  return sub ?? null;
}

export function isTokenExpired(token: string): boolean {
  const payload = decodePayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return payload.exp * 1000 < Date.now();
}

export function getRoleFromToken(token: string): string {
  const payload = decodePayload(token);
  if (!payload) return "user";
  const role = payload.role as string | undefined;
  return role ?? "user";
}

export function getInitialsFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

/** Normalize name for display: "rahul.kumar" or "rahul  kumar" → "rahul kumar" */
export function formatUserDisplayName(
  name?: string | null,
  email?: string | null
): string {
  if (name?.trim()) {
    return name
      .trim()
      .replace(/[._-]+/g, " ")
      .replace(/\s+/g, " ");
  }
  if (email) {
    const local = email.split("@")[0] ?? "";
    return local.replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim();
  }
  return "Account";
}

export function getInitialsFromName(name: string): string {
  const normalized = formatUserDisplayName(name);
  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return normalized.slice(0, 2).toUpperCase();
}
