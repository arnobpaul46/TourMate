"use client";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import StatusBadge from "@/components/shared/StatusBadge";
import TableSkeleton from "@/components/shared/TableSkeleton";
import {
  Booking,
  BookingStatus,
  fetchBookings,
  updateBookingStatus,
} from "@/lib/api/bookings";
import { selectClass } from "@/lib/constants/formStyles";
import { useQueryToastError } from "@/hooks/useQueryToastError";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck } from "lucide-react";
import { toast } from "sonner";

const statusOptions: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
];

const adminStatusOptions = ["CONFIRMED", "CANCELLED", "COMPLETED"] as const;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminBookingsPage() {
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  useQueryToastError(
    bookingsQuery.isError,
    bookingsQuery.error,
    "Failed to load bookings."
  );

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      bookingStatus,
    }: {
      id: string;
      bookingStatus: (typeof adminStatusOptions)[number];
    }) => updateBookingStatus(id, { bookingStatus }),
    onSuccess: () => {
      toast.success("Booking status updated");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to update status."));
    },
  });

  const handleStatusChange = (
    booking: Booking,
    value: (typeof adminStatusOptions)[number]
  ) => {
    if (value === booking.bookingStatus) return;
    statusMutation.mutate({ id: booking.id, bookingStatus: value });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          All Bookings
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          View and manage booking statuses across all users.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10">
        {bookingsQuery.isLoading ? (
          <TableSkeleton rows={5} />
        ) : bookingsQuery.isError ? (
          <div className="p-6">
            <ErrorState
              message="Failed to load bookings."
              onRetry={() => bookingsQuery.refetch()}
            />
          </div>
        ) : bookingsQuery.data?.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No bookings yet"
            description="Bookings from users will appear here once they reserve a tour."
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-800/50 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Package</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Travel Date</th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">
                      Guests
                    </th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsQuery.data?.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-slate-800/50 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-white">
                        {booking.tourPackage.title}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        <div>{booking.user?.name ?? "—"}</div>
                        <div className="text-xs text-slate-500">
                          {booking.user?.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {formatDate(booking.travelDate)}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-400 lg:table-cell">
                        {booking.guests}
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-400">
                        BDT {booking.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={booking.bookingStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={booking.bookingStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              booking,
                              e.target.value as (typeof adminStatusOptions)[number]
                            )
                          }
                          disabled={
                            statusMutation.isPending ||
                            !statusOptions.includes(booking.bookingStatus)
                          }
                          className={`${selectClass} h-9 text-xs`}
                        >
                          {booking.bookingStatus === "PENDING" && (
                            <option value="PENDING">PENDING</option>
                          )}
                          {adminStatusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {bookingsQuery.data?.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-white">
                      {booking.tourPackage.title}
                    </p>
                    <StatusBadge status={booking.bookingStatus} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {booking.user?.name} · {booking.user?.email}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>{formatDate(booking.travelDate)}</span>
                    <span>{booking.guests} guests</span>
                    <span className="text-emerald-400">
                      BDT {booking.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <select
                    value={booking.bookingStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        booking,
                        e.target.value as (typeof adminStatusOptions)[number]
                      )
                    }
                    disabled={
                      statusMutation.isPending ||
                      !statusOptions.includes(booking.bookingStatus)
                    }
                    className={`${selectClass} mt-4 h-10 text-xs`}
                  >
                    {booking.bookingStatus === "PENDING" && (
                      <option value="PENDING">PENDING</option>
                    )}
                    {adminStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
