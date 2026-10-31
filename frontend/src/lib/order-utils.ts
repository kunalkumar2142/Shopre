import type { Order } from "@/types/order";

export const formatCurrency = (value: number | null | undefined): string =>
  typeof value === "number" && Number.isFinite(value) ? `$${value.toFixed(2)}` : "$0.00";

const toDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function formatOrderDate(value?: string | null): string {
  const date = toDate(value);
  if (!date) return value || "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatOrderDateTime(value?: string | null): string {
  const date = toDate(value);
  if (!date) return value || "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPaymentMethod(value?: string | null): string {
  if (!value) return "—";
  return value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const countOrderItems = (order: Order): number =>
  order.items.reduce((sum, item) => sum + item.quantity, 0);
