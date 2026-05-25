export function getEmailFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
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
