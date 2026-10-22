import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, getClientEnv } from "@/lib/env";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * GET /admin/auth/callback
 *
 * Handles the magic-link callback from Supabase Auth:
 * 1. Supports PKCE authorization code (`code`) and token_hash (`token_hash` & `type`)
 * 2. Exchanges code for session cookies via `@supabase/ssr`
 * 3. Enforces server-side email allowlist verification
 * 4. Ensures database provisioning in `public.admin_users`
 * 5. Sanitizes redirect destination to eliminate open-redirect vulnerabilities
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  const env = getClientEnv();
  const siteUrl = env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || origin;

  // Validate redirect destination (only internal paths permitted)
  const safeNextPath =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
  const redirectTarget = `${siteUrl}${safeNextPath}`;

  if (!code && !token_hash) {
    return NextResponse.redirect(`${siteUrl}/admin/login?error=no_code`);
  }

  try {
    const supabase = await createClient();

    if (code) {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        console.error("Code exchange error:", exchangeError.message);
        return NextResponse.redirect(`${siteUrl}/admin/login?error=invalid_code`);
      }
    } else if (token_hash && type) {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash,
        type,
      });
      if (verifyError) {
        console.error("Verify OTP error:", verifyError.message);
        return NextResponse.redirect(`${siteUrl}/admin/login?error=invalid_code`);
      }
    }

    // Verify authenticated user & allowlist
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email || !isAdminEmail(user.email)) {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${siteUrl}/admin/login?error=unauthorized`);
    }

    // Enforce database-level authorization in public.admin_users
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminClient = createAdminClient();

      const { data: existingAdmin } = await adminClient
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existingAdmin) {
        const { error: insertError } = await adminClient
          .from("admin_users")
          .insert({ user_id: user.id });

        if (insertError) {
          console.error(
            "Failed to bootstrap admin_users record:",
            insertError.message,
          );
          await supabase.auth.signOut();
          return NextResponse.redirect(
            `${siteUrl}/admin/login?error=provision_failed`,
          );
        }
      }
    } catch (provisionErr) {
      console.error("Admin DB verification exception:", provisionErr);
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${siteUrl}/admin/login?error=provision_failed`,
      );
    }

    // Successfully authenticated and authorized
    return NextResponse.redirect(redirectTarget);
  } catch (error) {
    console.error("Auth callback unexpected error:", error);
    return NextResponse.redirect(`${siteUrl}/admin/login?error=callback_failed`);
  }
}
