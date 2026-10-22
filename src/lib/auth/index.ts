import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/env";

/**
 * Gets the currently authenticated user from the server-side session.
 * Returns null if no valid session exists.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Verifies that the current user is an authenticated admin.
 * Returns the user if authorized, otherwise redirects to login.
 *
 * Use this in protected Server Components and Route Handlers.
 */
export async function requireAdmin() {
  const user = await getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify the user's email is in the admin allowlist
  if (!user.email || !isAdminEmail(user.email)) {
    // Sign out the unauthorized user
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  // Verify the user exists in admin_users table (database-backed authorization)
  const supabase = await createClient();
  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!adminRecord) {
    // User is in the allowlist but not yet provisioned in the database.
    // This happens on first login — provision them automatically.
    const { error: insertError } = await supabase
      .from("admin_users")
      .insert({ user_id: user.id });

    // If insert fails (RLS prevents it because they're not yet admin),
    // use the admin client to bootstrap
    if (insertError) {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminClient = createAdminClient();
      const { error: adminInsertError } = await adminClient
        .from("admin_users")
        .insert({ user_id: user.id });

      if (adminInsertError) {
        console.error("Failed to provision admin user:", adminInsertError.message);
        const signOutClient = await createClient();
        await signOutClient.auth.signOut();
        redirect("/admin/login?error=provision_failed");
      }
    }
  }

  return user;
}

/**
 * Checks if a user is an admin without redirecting.
 * Useful for conditional rendering in layouts.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();

  if (!user || !user.email) {
    return false;
  }

  if (!isAdminEmail(user.email)) {
    return false;
  }

  const supabase = await createClient();
  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  return !!adminRecord;
}
