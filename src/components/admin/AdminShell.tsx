"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { AdminTopHeader } from "./AdminTopHeader";
import { IconClose, IconLogout } from "./AdminIcons";

interface AdminShellProps {
  user: {
    email?: string | null;
  };
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* DESKTOP SIDEBAR (Static sticky on lg screens) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-zinc-800/80 bg-zinc-900/40 p-5 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Brand & Editorial Title */}
          <div className="pb-4 border-b border-zinc-800/80">
            <Link href="/admin" className="group block">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">
                Debian Firwanto
              </span>
              <h1 className="text-base font-bold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                Portfolio CMS
              </h1>
            </Link>
            <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Admin v1.0</span>
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <AdminSidebarNav />
        </div>

        {/* Sidebar Footer: Authorized User info & Sign Out */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          <div className="rounded-lg bg-zinc-950/60 p-3 border border-zinc-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500">
                Authorized Session
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            </div>
            <p
              className="mt-1 truncate text-xs font-mono text-zinc-200 font-medium"
              title={user.email ?? "Admin"}
            >
              {user.email ?? "admin@portfolio"}
            </p>
          </div>

          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs font-medium text-zinc-400 transition-all hover:bg-red-950/20 hover:border-red-900/40 hover:text-red-300"
            >
              <IconLogout className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE DRAWER BACKDROP & SIDEBAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding Drawer */}
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col justify-between bg-zinc-900 border-r border-zinc-800 p-6 shadow-2xl">
            <div className="space-y-6">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                    Debian Firwanto
                  </span>
                  <h2 className="text-base font-bold text-zinc-100">Portfolio CMS</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  aria-label="Close navigation menu"
                >
                  <IconClose className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items (auto-closes drawer on click) */}
              <AdminSidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>

            {/* Mobile Footer */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="rounded-lg bg-zinc-950/60 p-3 border border-zinc-800">
                <p className="text-[10px] uppercase font-semibold text-zinc-500">
                  Signed in as
                </p>
                <p className="truncate text-xs font-mono text-zinc-200 mt-0.5">
                  {user.email}
                </p>
              </div>

              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-red-950/30 hover:text-red-300"
                >
                  <IconLogout className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN LAYOUT WRAPPER (Header + Children) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopHeader
          userEmail={user.email}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        <footer className="border-t border-zinc-800/60 px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-zinc-600">
          Portfolio Admin Foundation • Built with Next.js App Router & Supabase Auth/PostgreSQL
        </footer>
      </div>
    </div>
  );
}
