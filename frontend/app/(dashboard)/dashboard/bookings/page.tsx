"use client";

import ReviewModal from "@/components/dashboard/ReviewModal";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import StatusBadge from "@/components/shared/StatusBadge";
import Skeleton from "@/components/shared/Skeleton";
import {
  Booking,
  cancelBooking,
  fetchBookings,
} from "@/lib/api/bookings";
import { useQueryToastError } from "@/hooks/useQueryToastError";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  ExternalLink,
  MessageSquarePlus,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function BookingCardItem({
  booking,
  onCancel,
  onReview,
  cancelPending,
}: {
  booking: Booking;
  onCancel: (booking: Booking) => void;
  onReview: (booking: Booking) => void;
  cancelPending: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/10 sm:flex-row sm:items-center">
      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl sm:w-24">
        <ImageWithFallback
          src={undefined}
          alt={booking.tourPackage.title}
          sizes="96px"
          containerClassName="absolute inset-0"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-bold text-white">{booking.tourPackage.title}</h3>
          <StatusBadge status={booking.bookingStatus} />
        </div>
        <p className="mt-1 text-sm text-slate-400">
          {booking.tourPackage.location}
        </p>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
          <span>Travel: {formatDate(booking.travelDate)}</span>
          <span>{booking.guests} guest{booking.guests !== 1 ? "s" : ""}</span>
          <span className="font-medium text-emerald-400">
            BDT {booking.totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
        <Link
          href={`/packages/${booking.tourPackageId}`}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-slate-700 px-4 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View
        </Link>
        {booking.bookingStatus === "PENDING" && (
          <button
            type="button"
            onClick={() => onCancel(booking)}
            disabled={cancelPending}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-red-500/30 px-4 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            <XCircle className="h-3.5 w-3.5" />
            Cancel
          </button>
        )}
        {booking.bookingStatus === "COMPLETED" && (
          <button
            type="button"
            onClick={() => onReview(booking)}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-emerald-500/30 px-4 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/10"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            Review
          </button>
        )}
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  useQueryToastError(
    bookingsQuery.isError,
    bookingsQuery.error,
    "Failed to load bookings."
  );

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to cancel booking."));
    },
  });

  const handleCancel = (booking: Booking) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    cancelMutation.mutate(booking.id);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          My Bookings
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          View and manage your tour bookings.
        </p>
      </div>

      {bookingsQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : bookingsQuery.isError ? (
        <ErrorState
          message="Failed to load bookings. Please try again."
          onRetry={() => bookingsQuery.refetch()}
        />
      ) : bookingsQuery.data?.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="Browse packages to book your first tour adventure."
          actionLabel="Explore packages"
          actionHref="/packages"
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-800/50 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Package</th>
                    <th className="px-4 py-3 font-medium">Travel Date</th>
                    <th className="px-4 py-3 font-medium">Guests</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsQuery.data?.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-slate-800/50 last:border-0"
                    >
                      <td className="px-4 py-4 font-medium text-white">
                        {booking.tourPackage.title}
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {formatDate(booking.travelDate)}
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {booking.guests}
                      </td>
                      <td className="px-4 py-4 font-medium text-emerald-400">
                        BDT {booking.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={booking.bookingStatus} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {booking.bookingStatus === "PENDING" && (
                            <button
                              type="button"
                              onClick={() => handleCancel(booking)}
                              disabled={cancelMutation.isPending}
                              className="inline-flex items-center gap-1 rounded-full border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel
                            </button>
                          )}
                          {booking.bookingStatus === "COMPLETED" && (
                            <button
                              type="button"
                              onClick={() => setReviewTarget(booking)}
                              className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10"
                            >
                              <MessageSquarePlus className="h-3.5 w-3.5" />
                              Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {bookingsQuery.data?.map((booking) => (
              <BookingCardItem
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
                onReview={setReviewTarget}
                cancelPending={cancelMutation.isPending}
              />
            ))}
          </div>
        </>
      )}

      {reviewTarget && (
        <ReviewModal
          isOpen={Boolean(reviewTarget)}
          tourPackageId={reviewTarget.tourPackageId}
          packageTitle={reviewTarget.tourPackage.title}
          onClose={() => setReviewTarget(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["tour-packages"] });
            queryClient.invalidateQueries({
              queryKey: ["tour-package", reviewTarget.tourPackageId],
            });
          }}
        />
      )}
    </div>
  );
}
