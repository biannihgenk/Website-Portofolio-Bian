import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getClientEnv, isAdminEmail } from "@/lib/env";

/**
 * Updates the Supabase session in middleware.
 * Refreshes session cookies on every request and protects admin routes.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const env = getClientEnv();

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — keeps the user's session active
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/admin/login");
  const isAuthCallback = pathname.startsWith("/admin/auth");

  // Helper to copy updated session cookies to redirect responses
  const createRedirectWithCookies = (url: URL) => {
    const redirectRes = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectRes.cookies.set(cookie);
    });
    return redirectRes;
  };

  // 1. Unauthenticated users trying to access protected /admin routes
  if (!user && isAdminRoute && !isLoginRoute && !isAuthCallback) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return createRedirectWithCookies(url);
  }

  // 2. Authenticated users lacking admin authorization trying to access /admin
  if (user && isAdminRoute && !isLoginRoute && !isAuthCallback) {
    if (!user.email || !isAdminEmail(user.email)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "unauthorized");
      return createRedirectWithCookies(url);
    }
  }

  // 3. Authorized admin visiting /admin/login -> redirect straight to /admin dashboard
  if (
    user?.email &&
    isAdminEmail(user.email) &&
    isLoginRoute &&
    !request.nextUrl.searchParams.has("error")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return createRedirectWithCookies(url);
  }

  return supabaseResponse;
}
