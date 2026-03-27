import { HOURS_MIN, HOURS_MAX, MINUTES_MIN, MINUTES_MAX } from "./constants";

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const normalizeDomain = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  let domain = value.trim().toLowerCase();
  if (!domain) {
    return null;
  }

  if (domain.startsWith("https://")) {
    domain = domain.slice("https://".length);
  } else if (domain.startsWith("http://")) {
    domain = domain.slice("http://".length);
  }

  if (domain.includes("/")) {
    domain = domain.split("/")[0];
  }

  if (domain.includes(":")) {
    const [host, port] = domain.split(":");
    if (host && /^\d+$/.test(port || "")) {
      domain = host;
    }
  }

  domain = domain.replace(/\.$/, "");

  if (!domain) {
    return null;
  }
  if (!/^[a-z0-9.-]+$/.test(domain)) {
    return null;
  }
  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) {
    return null;
  }

  return domain;
};

export const normalizeDomainList = (values: unknown): string[] => {
  if (!Array.isArray(values)) {
    return [];
  }

  const seen = new Set<string>();
  const domains: string[] = [];

  for (const value of values) {
    const normalized = normalizeDomain(value);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    domains.push(normalized);
  }

  return domains;
};

export const formatDuration = (seconds: number): string => {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export const validateTheme = (value: unknown): value is "light" | "dark" =>
  value === "light" || value === "dark";

export const getSystemTheme = (): "light" | "dark" =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
