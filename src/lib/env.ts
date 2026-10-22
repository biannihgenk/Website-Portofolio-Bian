import { z } from "zod";

/**
 * Server-side environment variables schema.
 * These are validated when the server starts and must never be exposed to the client.
 */
const rawServerEnvSchema = z.object({
  secretKey: z
    .string()
    .min(1, "SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY is required"),
  ADMIN_EMAIL_ALLOWLIST: z
    .string()
    .min(1, "ADMIN_EMAIL_ALLOWLIST is required")
    .transform((val) => val.split(",").map((email) => email.trim().toLowerCase()))
    .pipe(z.array(z.string().email("Invalid email in ADMIN_EMAIL_ALLOWLIST"))),
});

/**
 * Client-safe environment variables schema.
 * These are available in both server and client code.
 */
const rawClientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  publishableKey: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL"),
});

export interface ClientEnv {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_SITE_URL: string;
}

export interface ServerEnv {
  SUPABASE_SECRET_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_EMAIL_ALLOWLIST: string[];
}

/**
 * Validates and returns client-safe environment variables.
 * Supports both modern (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) and legacy (NEXT_PUBLIC_SUPABASE_ANON_KEY) naming.
 * Safe to call from both server and client code.
 */
export function getClientEnv(): ClientEnv {
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;

  const parsed = rawClientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    publishableKey,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([field, msgs]) => `  ${field}: ${msgs?.join(", ")}`)
      .join("\n");
    throw new Error(`❌ Invalid client environment variables:\n${message}`);
  }

  const { NEXT_PUBLIC_SUPABASE_URL, publishableKey: key, NEXT_PUBLIC_SITE_URL } =
    parsed.data;

  return {
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: key,
    NEXT_PUBLIC_SITE_URL,
  };
}

/**
 * Validates and returns server-only environment variables.
 * Supports both modern (SUPABASE_SECRET_KEY) and legacy (SUPABASE_SERVICE_ROLE_KEY) naming.
 * Strictly forbidden from browser-side client bundles.
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error(
      "❌ Fatal: getServerEnv() cannot be accessed from client-side browser code.",
    );
  }

  const secretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  const parsed = rawServerEnvSchema.safeParse({
    secretKey,
    ADMIN_EMAIL_ALLOWLIST: process.env.ADMIN_EMAIL_ALLOWLIST,
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([field, msgs]) => `  ${field}: ${msgs?.join(", ")}`)
      .join("\n");
    throw new Error(`❌ Invalid server environment variables:\n${message}`);
  }

  const { secretKey: key, ADMIN_EMAIL_ALLOWLIST } = parsed.data;

  return {
    SUPABASE_SECRET_KEY: key,
    SUPABASE_SERVICE_ROLE_KEY: key,
    ADMIN_EMAIL_ALLOWLIST,
  };
}

/**
 * Checks if a given email is in the admin allowlist.
 * Must only be called from server-side code.
 */
export function isAdminEmail(email: string): boolean {
  const { ADMIN_EMAIL_ALLOWLIST } = getServerEnv();
  return ADMIN_EMAIL_ALLOWLIST.includes(email.toLowerCase().trim());
}
