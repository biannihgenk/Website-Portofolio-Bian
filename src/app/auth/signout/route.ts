import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getClientEnv } from "@/lib/env";

/**
 * Signs out the current user, clears Supabase session cookies,
 * and redirects to the admin login page with HTTP 303 See Other.
 */
async function handleSignOut(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const env = getClientEnv();
    const siteUrl =
      env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || request.nextUrl.origin;

    return NextResponse.redirect(`${siteUrl}/admin/login`, {
      status: 303,
    });
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.redirect(new URL("/admin/login", request.url), {
      status: 303,
    });
  }
}

export async function POST(request: NextRequest) {
  return handleSignOut(request);
}

export async function GET(request: NextRequest) {
  return handleSignOut(request);
}
