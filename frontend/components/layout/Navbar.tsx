"use client";

import Sheet from "@/components/ui/Sheet";
import { useAuth } from "@/context/AuthContext";
import {
  Compass,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navLinkClass = (active: boolean) =>
  `flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    active
      ? "bg-emerald-500/15 text-emerald-400"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardHref =
    user?.role === "ADMIN" ? "/admin" : "/dashboard/bookings";

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.push("/login");
  };

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/packages", label: "Packages", icon: Package },
    ...(isAuthenticated
      ? [{ href: dashboardHref, label: "Dashboard", icon: LayoutDashboard }]
      : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl lg:h-20">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-emerald-400"
          >
            <Compass className="h-6 w-6" />
            TourMate
          </Link>

          <nav className="hidden items-center gap-2 lg:flex lg:flex-1 lg:justify-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition hover:text-emerald-400 ${
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href))
                    ? "text-emerald-400"
                    : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            {!isLoading && isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <User className="h-4 w-4 text-emerald-400" />
                  <span className="font-medium text-white">{user.name}</span>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300">
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white active:scale-95"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              !isLoading && (
                <Link
                  href="/login"
                  className="inline-flex min-h-11 items-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95"
                >
                  Login
                </Link>
              )
            )}
          </div>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-700 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-slate-300" />
          </button>
        </div>
      </header>

      <Sheet
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        side="right"
        title="Menu"
      >
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass(active)}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-slate-800 pt-6">
          {!isLoading && isAuthenticated && user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{user.name}</p>
                  <p className="truncate text-xs text-slate-400">{user.email}</p>
                  <span className="mt-1 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-700 text-sm font-medium text-slate-300"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            !isLoading && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 w-full items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white"
              >
                Login
              </Link>
            )
          )}
        </div>
      </Sheet>
    </>
  );
}
