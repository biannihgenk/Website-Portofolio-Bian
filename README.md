# Personal Portfolio & CMS — Debian Firwanto

A secure, high-performance personal portfolio website with an integrated private Content Management System (CMS), built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, Storage)**.

---

## 🚀 Key Features

- **App Router Architecture**: Next.js 16+ utilizing React Server Components (RSC) for maximum performance and minimal client bundle size.
- **Bilingual Internationalization (i18n)**: App Router-compatible localization via `next-intl` with `[locale]` segments (`id` default, `en`).
- **Database-Driven Content**: PostgreSQL schema with 10 core tables and automated timestamp triggers.
- **Row Level Security (RLS)**: Enforced database-level security isolating draft content and allowing only the verified admin to mutate records.
- **Single-Admin Passwordless Auth**: Secure email magic links with two-factor authorization checks (allowlist + database record) and enumeration prevention.
- **Media Asset Pipeline**: Supabase Storage (`portfolio-public`) integration with server-side MIME type validation and file size limits (5MB).
- **Minimal Admin Foundation**: Protected admin shell with environment diagnostics, module overview, and sign-out controls.

---

## 📋 Prerequisites

- **Node.js**: `v20.0.0` or later (tested on v26.10.0)
- **npm**: `v10.0.0` or later (tested on v11.19.1)
- **Supabase Account**: Free or Pro tier project (or local Supabase CLI)

---

## 🛠️ Quick Start

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd "website Portofolio"
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`:
```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAIL_ALLOWLIST=firwanto.debian@gmail.com
```

### 3. Database Migration
Apply the PostgreSQL migration to your Supabase project:
- Navigate to the **SQL Editor** in your Supabase Dashboard.
- Copy and run the SQL from [`supabase/migrations/00001_initial_schema.sql`](supabase/migrations/00001_initial_schema.sql).
- *(Optional)* Run [`supabase/seed.sql`](supabase/seed.sql) to populate test items.

### 4. Create Storage Bucket
In your Supabase Dashboard under **Storage**:
- Create a bucket named `portfolio-public`.
- Toggle **Public bucket** to `ON`.
- Set allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`.
- Set max file size: `5MB`.

### 5. Run the Development Server
```bash
npm run dev
```

Visit:
- Public Homepage: [http://localhost:3000](http://localhost:3000) (Redirects to `/id`)
- English Homepage: [http://localhost:3000/en](http://localhost:3000/en)
- Admin Login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin) (Requires authentication)

---

## 🧪 Verification Commands

| Command | Purpose |
|---|---|
| `npm run type-check` | Runs strict TypeScript verification (`tsc --noEmit`) |
| `npm run lint` | Runs ESLint analysis |
| `npm run build` | Builds the production Next.js bundle |
| `npm run start` | Starts the production server locally |

---

## 📚 Technical Documentation

Detailed documentation is available in the [`docs/`](docs/) directory:

- [**Architecture Guide**](docs/ARCHITECTURE.md): System design, request lifecycles, and Server/Client boundaries.
- [**Database Documentation**](docs/DATABASE.md): Entity relationships, table schemas, triggers, and migration workflows.
- [**Authentication Guide**](docs/AUTHENTICATION.md): Magic-link OTP flow, single-admin allowlisting, and session refresh.
- [**Security Policies**](docs/SECURITY.md): Row Level Security (RLS) matrix, storage policies, and threat model.
- [**Environment Setup**](docs/ENVIRONMENT.md): Environment variables reference, local vs production configuration, and Supabase free-tier limits.
- [**Implementation Status**](docs/IMPLEMENTATION_STATUS.md): Current completion checklist, test results, and next phase roadmap.

---

## 🧭 Project Directory Structure

```
├── docs/                   # Technical documentation
│   ├── ARCHITECTURE.md
│   ├── AUTHENTICATION.md
│   ├── DATABASE.md
│   ├── ENVIRONMENT.md
│   ├── IMPLEMENTATION_STATUS.md
│   └── SECURITY.md
├── src/
│   ├── app/
│   │   ├── [locale]/       # Public localized routes (/id, /en)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── admin/          # Admin CMS routes
│   │   │   ├── (dashboard)/# Protected admin dashboard shell & modules
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── projects/page.tsx
│   │   │   │   ├── blog/page.tsx
│   │   │   │   ├── gallery/page.tsx
│   │   │   │   ├── achievements/page.tsx
│   │   │   │   ├── education/page.tsx
│   │   │   │   ├── media/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   ├── auth/       # Magic-link login & callback API routes
│   │   │   └── login/      # Admin login page
│   │   ├── auth/signout/   # Server-side sign-out route
│   │   ├── globals.css     # Global styles & design system tokens
│   │   └── layout.tsx      # Root layout
│   ├── lib/
│   │   ├── auth/           # Server-side admin authorization helpers
│   │   ├── content/        # Public reads & admin mutations
│   │   ├── env.ts          # Zod environment validation
│   │   ├── i18n/           # next-intl configuration
│   │   ├── storage/        # Media asset upload & validation
│   │   ├── supabase/       # Browser, Server, Admin clients & middleware
│   │   └── validation/     # Zod data schemas
│   ├── messages/           # Translation dictionaries (id.json, en.json)
│   ├── middleware.ts       # Route session refresh & i18n middleware
│   └── types/              # Database & content TypeScript types
├── supabase/
│   ├── migrations/         # Version-controlled SQL migrations
│   └── seed.sql            # Development test seed data
├── .env.example            # Environment template (safe defaults)
└── package.json            # Project dependencies & scripts
```

---

## 🛠️ Troubleshooting

- **Magic link not received**: Verify that your email is listed in `ADMIN_EMAIL_ALLOWLIST` in `.env.local`. Ensure Supabase Email settings are enabled and check your spam folder.
- **Database error on login**: Verify that `SUPABASE_SERVICE_ROLE_KEY` is present in `.env.local` so the system can provision the admin user in `public.admin_users`.
- **Next.js Prerender Issues**: Admin routes are configured with `export const dynamic = "force-dynamic"` to ensure session cookies are evaluated at request time.
