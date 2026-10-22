import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getClientEnv, getServerEnv } from "@/lib/env";
import type { Database } from "@/types/database.types";

/**
 * Creates a Supabase admin client using the service-role key.
 * This client BYPASSES RLS — use only for trusted server-side operations
 * that genuinely require elevated privileges.
 *
 * Examples:
 * - Provisioning the initial admin user
 * - System-level data operations
 *
 * NEVER use this for normal authenticated CMS operations.
 * NEVER expose this client to client-side code.
 */
export function createAdminClient() {
  const clientEnv = getClientEnv();
  const serverEnv = getServerEnv();

  return createSupabaseClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
