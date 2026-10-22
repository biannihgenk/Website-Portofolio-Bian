import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, getClientEnv } from "@/lib/env";
import { loginSchema } from "@/lib/validation/schemas";

/**
 * POST /admin/auth/login
 *
 * Handles magic-link login requests.
 * 1. Validates the email format
 * 2. Checks against the admin allowlist
 * 3. Sends a magic link via Supabase Auth
 *
 * Always returns a success-like response to avoid leaking
 * which emails are authorized.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate email format
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Alamat email tidak valid." },
        { status: 400 },
      );
    }

    const { email } = result.data;

    // Check admin allowlist — but always return the same response
    if (!isAdminEmail(email)) {
      // Return success to avoid revealing whether the email is authorized
      return NextResponse.json({ message: "Jika email terdaftar, link masuk telah dikirim." });
    }

    // Send magic link
    const supabase = await createClient();
    const env = getClientEnv();
    const redirectTo = `${env.NEXT_PUBLIC_SITE_URL}/admin/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error("Magic link error:", error.message);
      // Still return generic message
      return NextResponse.json({ message: "Jika email terdaftar, link masuk telah dikirim." });
    }

    return NextResponse.json({ message: "Jika email terdaftar, link masuk telah dikirim." });
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 },
    );
  }
}
