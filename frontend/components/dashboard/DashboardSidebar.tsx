"use client";

import { useAuth } from "@/context/AuthContext";
import {
  CalendarCheck,
  LayoutDashboard,
  Package,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const userLinks = [
  { href: "/dashboard/bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/packages", label: "Browse Packages", icon: Package },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl lg:sticky lg:top-24">
        <div className="mb-6 flex items-center gap-2 text-emerald-400">
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-bold text-white">Dashboard</span>
        </div>

        {user && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="space-y-1">
          {userLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

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
