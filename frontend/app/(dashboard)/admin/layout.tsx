"use client";

import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (user?.role !== "ADMIN") {
      router.replace(user?.role === "USER" ? "/dashboard/bookings" : "/");
    }
  }, [isLoading, user, router]);

  if (isLoading || user?.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <AdminSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
