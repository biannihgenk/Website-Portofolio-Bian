"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconMenu, IconExternalLink, IconLogout } from "./AdminIcons";
import { ADMIN_NAV_ITEMS } from "./AdminSidebarNav";

interface AdminTopHeaderProps {
  userEmail?: string | null;
  onOpenMobileMenu: () => void;
}

export function AdminTopHeader({ userEmail, onOpenMobileMenu }: AdminTopHeaderProps) {
  const pathname = usePathname();

  // Determine current active section title
  const currentItem = ADMIN_NAV_ITEMS.find((item) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/")
  );
  const currentTitle = currentItem?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile menu trigger + Section title / breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          aria-label="Open mobile navigation menu"
        >
          <IconMenu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors hidden sm:inline"
          >
            admin
          </Link>
          <span className="text-xs text-zinc-700 hidden sm:inline">/</span>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
            {currentTitle}
          </h2>
        </div>
      </div>

      {/* Right: Actions, Public Link, User Badge & Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>PostgreSQL Active</span>
        </div>

        {/* View Public Website */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white"
          title="Open public portfolio website in a new tab"
        >
          <span className="hidden sm:inline">View Site</span>
          <IconExternalLink className="w-3.5 h-3.5 text-zinc-400" />
        </Link>

        {/* User email & Sign Out */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="hidden lg:block text-right">
            <p className="text-[11px] font-mono text-zinc-300 truncate max-w-[150px]" title={userEmail ?? "Admin"}>
              {userEmail ?? "admin"}
            </p>
            <p className="text-[10px] text-zinc-500">Super Admin</p>
          </div>

          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 p-2 sm:px-2.5 sm:py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-red-900/50 hover:bg-red-950/20 hover:text-red-300"
              title="Sign out of Admin CMS"
            >
              <IconLogout className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
