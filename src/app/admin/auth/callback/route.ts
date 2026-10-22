import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, getClientEnv } from "@/lib/env";

/**
 * GET /admin/auth/callback
 *
 * Handles the magic-link callback from Supabase Auth.
 * 1. Extracts the authorization code from the URL
 * 2. Exchanges it for a session
 * 3. Verifies the user is an authorized admin
 * 4. Redirects to the admin dashboard or login with error
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const env = getClientEnv();

  // Use the configured site URL as the redirect base (not the request origin)
  // to prevent open-redirect attacks
  const redirectBase = env.NEXT_PUBLIC_SITE_URL || origin;

  if (!code) {
    return NextResponse.redirect(`${redirectBase}/admin/login?error=no_code`);
  }

  try {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Code exchange error:", exchangeError.message);
      return NextResponse.redirect(`${redirectBase}/admin/login?error=invalid_code`);
    }

    // Verify the authenticated user is an admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email || !isAdminEmail(user.email)) {
      // Not an authorized admin — sign out and redirect
      await supabase.auth.signOut();
      return NextResponse.redirect(`${redirectBase}/admin/login?error=unauthorized`);
    }

    // Successfully authenticated and authorized
    return NextResponse.redirect(`${redirectBase}/admin`);
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(`${redirectBase}/admin/login?error=callback_failed`);
  }
}
