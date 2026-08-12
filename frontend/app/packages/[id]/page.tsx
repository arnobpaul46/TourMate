"use client";

import BookingCard from "@/components/packages/BookingCard";
import ImageGallery from "@/components/packages/ImageGallery";
import PackageCard from "@/components/shared/PackageCard";
import ReviewForm from "@/components/shared/ReviewForm";
import ReviewsList from "@/components/shared/ReviewsList";
import ErrorState from "@/components/shared/ErrorState";
import Skeleton from "@/components/shared/Skeleton";
import Sheet from "@/components/ui/Sheet";
import { useAuth } from "@/context/AuthContext";
import { useQueryToastError } from "@/hooks/useQueryToastError";
import { createBooking, fetchBookings } from "@/lib/api/bookings";
import { fetchTourPackageById, fetchTourPackages } from "@/lib/api/tours";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Clock,
  MapPin,
  Star,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const id = params.id as string;

  const [travelDate, setTravelDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingSheetOpen, setBookingSheetOpen] = useState(false);

  const packageQuery = useQuery({
    queryKey: ["tour-package", id],
    queryFn: () => fetchTourPackageById(id),
    enabled: Boolean(id),
  });

  useQueryToastError(
    packageQuery.isError,
    packageQuery.error,
    "Failed to load tour package."
  );

  const relatedQuery = useQuery({
    queryKey: ["tour-packages", "related", packageQuery.data?.categoryId],
    queryFn: () =>
      fetchTourPackages({
        categoryId: packageQuery.data?.categoryId,
        limit: 6,
      }),
    enabled: Boolean(packageQuery.data?.categoryId),
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    enabled: isAuthenticated,
  });

  const tour = packageQuery.data;

  const hasCompletedBooking = useMemo(
    () =>
      bookingsQuery.data?.some(
        (booking) =>
          booking.tourPackageId === id &&
          booking.bookingStatus === "COMPLETED"
      ) ?? false,
    [bookingsQuery.data, id]
  );

  const userAlreadyReviewed = useMemo(
    () =>
      tour?.reviews.some((review) => review.user.id === user?.id) ?? false,
    [tour?.reviews, user?.id]
  );

  const canWriteReview =
    isAuthenticated && hasCompletedBooking && !userAlreadyReviewed;

  const totalPrice = useMemo(() => {
    if (!tour) return 0;
    return tour.price * guests;
  }, [tour, guests]);

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success("Booking created successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["tour-packages"] });
      queryClient.invalidateQueries({ queryKey: ["tour-package", id] });
      router.push("/dashboard/bookings");
    },
    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(error, "Failed to create booking. Please try again.")
      );
    },
  });

  const handleBookNow = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!travelDate) {
      if (window.innerWidth < 1024) {
        setBookingSheetOpen(true);
        toast.error("Please select a travel date");
        return;
      }
      toast.error("Please select a travel date");
      return;
    }

    if (!tour) return;

    if (guests < 1) {
      toast.error("Guests must be at least 1");
      return;
    }

    if (guests > tour.maxGroupSize) {
      toast.error(`Maximum ${tour.maxGroupSize} guests allowed`);
      return;
    }

    bookingMutation.mutate({
      tourPackageId: tour.id,
      travelDate,
      guests,
    });
  };

  if (packageQuery.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-72 rounded-2xl md:h-96" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (packageQuery.isError || !tour) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          message="Tour package not found or failed to load."
          onRetry={() => packageQuery.refetch()}
        />
        <div className="mt-4 text-center">
          <Link
            href="/packages"
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            ← Back to packages
          </Link>
        </div>
      </div>
    );
  }

  const avgRating =
    tour.reviews.length > 0
      ? tour.reviews.reduce((sum, review) => sum + review.rating, 0) /
        tour.reviews.length
      : 0;

  const relatedPackages =
    relatedQuery.data?.data.filter((pkg) => pkg.id !== tour.id).slice(0, 4) ??
    [];

  return (
    <div className="overflow-hidden bg-slate-950 pb-24 lg:pb-10">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <ImageGallery
              images={tour.images}
              categorySlug={tour.category?.slug}
              title={tour.title}
            />

            <div className="mt-6">
              {tour.category && (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  {tour.category.name}
                </span>
              )}
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {tour.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  {tour.location}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                  {tour.duration} days
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1">
                  <Users className="h-3.5 w-3.5 text-emerald-400" />
                  Max {tour.maxGroupSize}
                </span>
                {avgRating > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {avgRating.toFixed(1)} ({tour.reviews.length})
                  </span>
                )}
              </div>

              <p className="mt-4 text-2xl font-bold text-emerald-400 lg:hidden">
                BDT {tour.price.toLocaleString()}
                <span className="text-sm font-normal text-slate-400">
                  {" "}
                  / person
                </span>
              </p>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                <h2 className="text-lg font-bold text-white">About this tour</h2>
                <div className="prose prose-invert mt-3 max-w-none text-sm leading-relaxed text-slate-300 sm:text-base">
                  <p className="whitespace-pre-line">{tour.description}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                  <h3 className="font-semibold text-white">Included</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-400">
                    {[
                      "Professional guide",
                      "Transportation",
                      "Accommodation",
                      "Meals as per itinerary",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                  <h3 className="font-semibold text-white">Not included</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-400">
                    {[
                      "Personal expenses",
                      "Travel insurance",
                      "Optional activities",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <X className="h-4 w-4 shrink-0 text-red-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {canWriteReview && <ReviewForm tourPackageId={tour.id} />}

                {isAuthenticated && !hasCompletedBooking && (
                  <p className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 p-4 text-sm text-slate-400">
                    Complete a booking for this tour to leave a review.
                  </p>
                )}

                {isAuthenticated && hasCompletedBooking && userAlreadyReviewed && (
                  <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                    You have already reviewed this tour. Thank you!
                  </p>
                )}

                {!isAuthenticated && (
                  <p className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 p-4 text-sm text-slate-400">
                    <Link
                      href="/login"
                      className="font-medium text-emerald-400 hover:text-emerald-300"
                    >
                      Sign in
                    </Link>{" "}
                    after completing a booking to write a review.
                  </p>
                )}

                <ReviewsList reviews={tour.reviews} />
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <BookingCard
              tour={tour}
              travelDate={travelDate}
              guests={guests}
              totalPrice={totalPrice}
              isAuthenticated={isAuthenticated}
              authLoading={authLoading}
              isPending={bookingMutation.isPending}
              onTravelDateChange={setTravelDate}
              onGuestsChange={setGuests}
              onBook={handleBookNow}
              className="sticky top-24"
            />
          </aside>
        </div>

        {relatedPackages.length > 0 && (
          <section className="mt-12 border-t border-slate-800 pt-10">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Related packages
            </h2>
            <div className="mt-6 flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
              {relatedPackages.map((pkg) => (
                <div key={pkg.id} className="w-72 shrink-0 lg:w-auto">
                  <PackageCard tour={pkg} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-900/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-400">From</p>
            <p className="text-lg font-bold text-emerald-400">
              BDT {totalPrice.toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                router.push("/login");
                return;
              }
              setBookingSheetOpen(true);
            }}
            disabled={bookingMutation.isPending || authLoading}
            className="min-h-11 flex-1 max-w-[200px] rounded-full bg-emerald-500 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95 disabled:opacity-60"
          >
            {bookingMutation.isPending
              ? "Booking..."
              : isAuthenticated
                ? "Book Now"
                : "Login to Book"}
          </button>
        </div>
      </div>

      <Sheet
        open={bookingSheetOpen}
        onClose={() => setBookingSheetOpen(false)}
        side="bottom"
        title="Book this tour"
      >
        <BookingCard
          tour={tour}
          travelDate={travelDate}
          guests={guests}
          totalPrice={totalPrice}
          isAuthenticated={isAuthenticated}
          authLoading={authLoading}
          isPending={bookingMutation.isPending}
          onTravelDateChange={setTravelDate}
          onGuestsChange={setGuests}
          onBook={() => {
            handleBookNow();
            if (travelDate) setBookingSheetOpen(false);
          }}
          className="border-0 bg-transparent p-0 shadow-none backdrop-blur-none"
        />
        <button
          type="button"
          onClick={handleBookNow}
          disabled={bookingMutation.isPending || authLoading}
          className="mt-4 min-h-14 w-full rounded-full bg-emerald-500 text-sm font-semibold text-white lg:hidden"
        >
          {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
        </button>
      </Sheet>
    </div>
  );
}
