# Authentication & Authorization Architecture — Portfolio Debian Firwanto

## 1. Authentication Strategy

The system uses **Passwordless Magic Links** powered by Supabase Auth with server-side cookie sessions via `@supabase/ssr`.

No passwords or public self-registration forms are exposed. Only pre-authorized email addresses defined in `ADMIN_EMAIL_ALLOWLIST` can receive valid magic links and establish an admin session.

---

## 2. Magic-Link Lifecycle

```
[Administrator] ──> Enter Email at /admin/login
                          │
                          ▼
            POST /admin/auth/login
                          │
       ┌──────────────────┴──────────────────┐
       │ Is email in ADMIN_EMAIL_ALLOWLIST?   │
       └──────────────────┬──────────────────┘
                 YES      │       NO
         ┌────────────────┴───────────────┐
         ▼                                ▼
Call supabase.auth.signInWithOtp()   Do NOT call Supabase
Generate secure one-time token      Return same success response
Send magic link to inbox            (prevents email enumeration)
         │
         ▼
[Admin receives email] ──> Clicks link: /admin/auth/callback?code=...
                                  │
                                  ▼
                   GET /admin/auth/callback
                                  │
              Exchange code for Supabase auth session
                                  │
              Verify user.email is in allowlist
                                  │
               Ensure record in public.admin_users
                                  │
                  Set secure HTTP-only cookies
                                  │
                        Redirect to /admin
```

---

## 3. Single-Admin Policy & Self-Provisioning

1. **Environment Allowlist**:
   `ADMIN_EMAIL_ALLOWLIST` (comma-separated list of emails) is loaded on the server and validated with Zod.
2. **Database Provisioning**:
   When an authorized admin logs in for the first time:
   - The user exists in Supabase `auth.users`.
   - `requireAdmin()` checks `public.admin_users`. If absent, it bootstraps the user into `public.admin_users(user_id)`.
   - Once present in `admin_users`, PostgreSQL function `public.is_admin()` evaluates to `TRUE`, granting RLS privileges across all CMS tables.
3. **Defense in Depth**:
   Even if an unauthorized user creates an account through a direct Supabase client call:
   - Middleware blocks access to `/admin/*`.
   - `requireAdmin()` on the server checks the allowlist and immediately issues `signOut()`.
   - PostgreSQL RLS denies read/write access to CMS content.

---

## 4. Session Refresh & Invalidation

- **Middleware Refresh**: `src/middleware.ts` runs on all matching routes and calls `updateSession()`, refreshing expired tokens in the background and keeping the admin session alive across page navigations.
- **Sign Out**: `POST /auth/signout` calls `supabase.auth.signOut()` on the server, clears all session cookies, and redirects the client to `/admin/login`.

---

## 5. Security & Attack Surface Hardening

| Threat | Mitigation |
|---|---|
| User Enumeration | `/admin/auth/login` returns an identical response (`200 OK`) whether the email is allowlisted or not. |
| Open Redirect | `/admin/auth/callback` verifies `next` redirect parameters against `ALLOWED_REDIRECT_PATHS` or same-origin paths, rejecting external URLs. |
| Session Hijacking | Session tokens are stored in `HttpOnly`, `SameSite=Lax`, and `Secure` cookies managed by `@supabase/ssr`. |
| Client Key Leakage | Service role keys are exclusively server-side in `src/lib/supabase/admin.ts`. |
