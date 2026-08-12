"use client";

import { useAuth } from "@/context/AuthContext";
import {
  CalendarCheck,
  FolderTree,
  LayoutDashboard,
  Package,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl lg:sticky lg:top-24">
        <div className="mb-6 flex items-center gap-2 text-emerald-400">
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-bold text-white">Admin Panel</span>
        </div>

        {user && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
              <span className="mt-1 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300">
                ADMIN
              </span>
            </div>
          </div>
        )}

        <nav className="space-y-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
