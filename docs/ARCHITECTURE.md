# System Architecture — Portfolio Debian Firwanto

## 1. Overview

The Personal Portfolio Website for Debian Firwanto is a unified, database-driven application built on **Next.js App Router** and **Supabase (PostgreSQL, Auth, Storage)**. It combines a high-performance public portfolio with a private, secure Content Management System (CMS) in a single codebase.

```
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js 15+ App Router                     │
├───────────────────────────────┬─────────────────────────────────┤
│    Public Site (next-intl)    │     Admin CMS Shell (SSR)       │
│  - Routes: /[locale]/*        │  - Route: /admin/*              │
│  - Locales: 'id' (default), 'en'│  - Magic-link authentication   │
│  - Static & Server Components │  - Single-admin policy          │
│  - Reads: published rows only │  - Full CRUD & media operations │
├───────────────────────────────┴─────────────────────────────────┤
│                   Supabase Backend Services                     │
├───────────────────┬──────────────────────┬──────────────────────┤
│  PostgreSQL (RLS) │    Supabase Auth     │   Supabase Storage   │
│ - Strict policies │ - Passwordless OTP   │ - portfolio-public   │
│ - Versioned SQL   │ - Cookie-based SSR   │ - 5MB max, MIME check│
└───────────────────┴──────────────────────┴──────────────────────┘
```

---

## 2. Request and Data Flow

### 2.1 Public Visitor Flow
1. Visitor navigates to `/` or localized path (e.g. `/id` or `/en`).
2. `src/middleware.ts` runs `next-intl/middleware`, routing to the appropriate locale.
3. Server Component calls public query functions from `src/lib/content/queries.ts` (e.g., `getProjects()`).
4. Data is fetched via Supabase Server Client (`src/lib/supabase/server.ts`) using the anonymous publishable key.
5. Row Level Security (RLS) in PostgreSQL ensures only rows with `status = 'published'` are returned.
6. Server-rendered HTML is served with fast performance and SEO metadata.

### 2.2 Admin Authentication Flow
1. Administrator accesses `/admin/login` and inputs their email.
2. Route handler `src/app/admin/auth/login/route.ts` verifies email against `ADMIN_EMAIL_ALLOWLIST`.
3. If authorized, Supabase sends an email magic link containing a secure one-time token.
4. Response returns a uniform success message regardless of authorization to prevent email enumeration.
5. Administrator clicks the magic link in email, navigating to `GET /admin/auth/callback?code=...`.
6. Callback route exchanges the code for a Supabase session and sets secure HTTP-only cookies.
7. User is redirected to `/admin`.

### 2.3 CMS Admin Request Flow
1. `src/middleware.ts` runs `updateSession` to refresh the Supabase auth token on every request.
2. Protected layout `src/app/admin/(dashboard)/layout.tsx` invokes `await requireAdmin()`.
3. `requireAdmin()` checks session identity against the allowlist and verifies the user exists in `public.admin_users`.
4. Unauthorized users are immediately signed out and redirected to `/admin/login?error=unauthorized`.
5. Database queries made in the admin section execute with the authenticated admin user's credentials, satisfying `public.is_admin()` RLS policies.

---

## 3. Server / Client Boundaries

- **Default to Server Components**: All page wrappers, layout shells, and data fetchers are React Server Components (RSC) to minimize client bundle size and prevent leaking sensitive data.
- **Client Components ('use client')**: Confined strictly to interactive UI elements:
  - `src/app/admin/login/page.tsx` (Form submission, reactive loading & feedback states).
  - Navigation toggles, mobile drawers, or file dropzones (in subsequent design phases).
- **Environment Isolation**:
  - `NEXT_PUBLIC_*` variables are restricted to safe public values (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`).
  - Sensitive variables (`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL_ALLOWLIST`) are validated server-side in `src/lib/env.ts` and forbidden from client bundles.

---

## 4. Key Architectural Decisions

| Decision | Implementation | Rationale |
|---|---|---|
| Routing Model | App Router with localized group `[locale]` and non-localized `admin` | Ensures clean URLs (`/id`, `/en`) for public pages while keeping admin dashboards unlocalized and separate. |
| Authentication | Supabase Magic Link (Passwordless OTP) | Eliminates password management and credential compromise risks for the single website owner. |
| Authorization | Allowlist + Database `admin_users` table | Two-factor verification: email must be in environment allowlist AND provisioned in PostgreSQL `admin_users`. |
| Database Security | PostgreSQL Row Level Security (RLS) on all tables | Security at the database layer prevents leaks even if application code is misconfigured. |
| Type Safety | Strict TypeScript + Zod validation | End-to-end type safety from database rows to API payloads and form inputs. |
