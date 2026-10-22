import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getClientEnv } from "@/lib/env";

/**
 * POST /auth/signout
 *
 * Signs out the current user and redirects to the admin login page.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const env = getClientEnv();
    return NextResponse.redirect(`${env.NEXT_PUBLIC_SITE_URL}/admin/login`, {
      status: 302,
    });
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.redirect("/admin/login", { status: 302 });
  }
}
