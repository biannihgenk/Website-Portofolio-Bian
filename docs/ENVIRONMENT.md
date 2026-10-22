# Environment Configuration Guide — Portfolio Debian Firwanto

## 1. Overview

The application validates all configuration at runtime using Zod in `src/lib/env.ts`.

Copy `.env.example` to `.env.local` to configure your environment:
```bash
cp .env.example .env.local
```

---

## 2. Environment Variables

| Variable Name | Required | Scope | Description | Example / Default |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client & Server | The URL of your Supabase project instance. | `https://xyzproject.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client & Server | Public anonymous API key for client-side and RLS-enforced operations. | `eyJhbGciOi...` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Client & Server | Canonical site URL used for auth callback redirect validation and SEO. | `http://localhost:3000` (Dev) / `https://debianfirwanto.com` (Prod) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only | Elevated secret key for administrative tasks and admin bootstrapping. | `eyJhbGciOi...` |
| `ADMIN_EMAIL_ALLOWLIST` | Yes | Server-only | Comma-separated list of authorized administrator email addresses. | `firwanto.debian@gmail.com` |

---

## 3. Local Development vs. Production Setup

### 3.1 Local Development (`.env.local`)
```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_EMAIL_ALLOWLIST=firwanto.debian@gmail.com
```

### 3.2 Production (Vercel / Hosting Provider)
Configure environment variables in your hosting dashboard:
- Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://debianfirwanto.com`).
- Add the production redirect URL `https://debianfirwanto.com/admin/auth/callback` to the **Redirect URLs** allowlist in Supabase Dashboard (`Authentication` -> `URL Configuration`).
- Never check in production keys into version control.

---

## 4. Supabase Free-Tier Considerations

When operating on Supabase Free Plan:
1. **Inactivity Pausing**: Projects with no database traffic for 7 days will be paused. Waking up a paused project takes 1-2 minutes via dashboard.
2. **Database Quota**: 500 MB database storage limit.
3. **Storage Quota**: 1 GB storage limit for media assets.
4. **Bandwidth**: 2 GB per month file egress.
5. **Backups**: Daily automated backups retained for 7 days.
