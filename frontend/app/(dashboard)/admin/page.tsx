"use client";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import StatusBadge from "@/components/shared/StatusBadge";
import Skeleton from "@/components/shared/Skeleton";
import { fetchBookings } from "@/lib/api/bookings";
import { fetchTourPackages } from "@/lib/api/tours";
import { useQueryToastError } from "@/hooks/useQueryToastError";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarCheck,
  DollarSign,
  Package,
  Users,
} from "lucide-react";
import Link from "next/link";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminDashboardPage() {
  const packagesQuery = useQuery({
    queryKey: ["tour-packages", "admin-stats"],
    queryFn: () => fetchTourPackages({ limit: 100 }),
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  useQueryToastError(
    packagesQuery.isError,
    packagesQuery.error,
    "Failed to load stats."
  );

  const packages = packagesQuery.data?.data ?? [];
  const bookings = bookingsQuery.data ?? [];
  const revenue = bookings
    .filter((b) => b.bookingStatus !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const uniqueUsers = new Set(bookings.map((b) => b.userId)).size;

  const stats = [
    {
      label: "Total Packages",
      value: packages.length,
      icon: Package,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Bookings",
      value: bookings.length,
      icon: CalendarCheck,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Users",
      value: uniqueUsers,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Revenue",
      value: `BDT ${revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const isLoading = packagesQuery.isLoading || bookingsQuery.isLoading;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Overview of your TourMate platform
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : packagesQuery.isError ? (
        <ErrorState onRetry={() => packagesQuery.refetch()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="mt-4 text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Recent bookings</h2>
              <Link
                href="/admin/bookings"
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                View all →
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <EmptyState
                icon={CalendarCheck}
                title="No bookings yet"
                description="Bookings will appear here once users reserve tours."
              />
            ) : (
              <>
                <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-slate-800/50 text-slate-400">
                      <tr>
                        <th className="px-4 py-3 font-medium">Package</th>
                        <th className="px-4 py-3 font-medium">User</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Total</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-slate-800/50 last:border-0"
                        >
                          <td className="px-4 py-3 font-medium text-white">
                            {booking.tourPackage.title}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {booking.user?.name ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {formatDate(booking.travelDate)}
                          </td>
                          <td className="px-4 py-3 text-emerald-400">
                            BDT {booking.totalPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={booking.bookingStatus} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 md:hidden">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-white">
                          {booking.tourPackage.title}
                        </p>
                        <StatusBadge status={booking.bookingStatus} />
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {booking.user?.name} · {formatDate(booking.travelDate)}
                      </p>
                      <p className="mt-2 text-sm font-medium text-emerald-400">
                        BDT {booking.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
