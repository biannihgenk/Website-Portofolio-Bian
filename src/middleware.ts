import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "@/lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes: handle Supabase session only (no locale routing)
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return await updateSession(request);
  }

  // Public routes: apply i18n middleware then update Supabase session
  const intlResponse = intlMiddleware(request);

  // Also refresh Supabase session on public routes (for potential future auth needs)
  // But don't block on it — just return the intl response
  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
