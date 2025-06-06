import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenantURL(tenantSlug: string) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isSubdomainRoutingEnabled = process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === "true";

  // In development mode, use normal routing
  if (isDevelopment || !isSubdomainRoutingEnabled) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}`;
  }

  const protocol = "https"; // Always use HTTPS for production
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

  // In production, use subdomain routing
  return `${protocol}://${tenantSlug}.${domain}`;
};

export function formatCurrency(value: number | string, currency = "USD", locale = "en-US") {
  if(value === "") return "$0";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(Number(value));
};
