import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = "USD", locale: string = "en-US") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value ?? 0);
  } catch {
    return `$${(value ?? 0).toFixed(2)}`;
  }
}

export function formatDate(value: string | number | Date, locale: string = "en-US") {
  if (!value) return "-";
  try {
    const d = new Date(value);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return String(value);
  }
}
