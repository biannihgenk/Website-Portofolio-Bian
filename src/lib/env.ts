import { z } from "zod";

/**
 * Server-side environment variables.
 * These are validated when the server starts and must never be exposed to the client.
 */
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  ADMIN_EMAIL_ALLOWLIST: z
    .string()
    .min(1, "ADMIN_EMAIL_ALLOWLIST is required")
    .transform((val) => val.split(",").map((email) => email.trim().toLowerCase()))
    .pipe(z.array(z.string().email("Invalid email in ADMIN_EMAIL_ALLOWLIST"))),
});

/**
 * Client-safe environment variables.
 * These are prefixed with NEXT_PUBLIC_ and available in both server and client code.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Validates and returns client-safe environment variables.
 * Safe to call from both server and client code.
 */
export function getClientEnv(): ClientEnv {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([field, msgs]) => `  ${field}: ${msgs?.join(", ")}`)
      .join("\n");
    throw new Error(`❌ Invalid client environment variables:\n${message}`);
  }

  return parsed.data;
}

/**
 * Validates and returns server-only environment variables.
 * Must only be called from server-side code (Server Components, Route Handlers, Server Actions).
 */
export function getServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_EMAIL_ALLOWLIST: process.env.ADMIN_EMAIL_ALLOWLIST,
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([field, msgs]) => `  ${field}: ${msgs?.join(", ")}`)
      .join("\n");
    throw new Error(`❌ Invalid server environment variables:\n${message}`);
  }

  return parsed.data;
}

/**
 * Checks if a given email is in the admin allowlist.
 * Must only be called from server-side code.
 */
export function isAdminEmail(email: string): boolean {
  const { ADMIN_EMAIL_ALLOWLIST } = getServerEnv();
  return ADMIN_EMAIL_ALLOWLIST.includes(email.toLowerCase().trim());
}
