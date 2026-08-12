"use client";

import { inputClass, labelClass } from "@/lib/constants/formStyles";
import { TourPackageDetail } from "@/lib/api/tours";
import { Calendar, Users } from "lucide-react";

type BookingCardProps = {
  tour: TourPackageDetail;
  travelDate: string;
  guests: number;
  totalPrice: number;
  isAuthenticated: boolean;
  authLoading: boolean;
  isPending: boolean;
  onTravelDateChange: (value: string) => void;
  onGuestsChange: (value: number) => void;
  onBook: () => void;
  className?: string;
};

export default function BookingCard({
  tour,
  travelDate,
  guests,
  totalPrice,
  isAuthenticated,
  authLoading,
  isPending,
  onTravelDateChange,
  onGuestsChange,
  onBook,
  className,
}: BookingCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-800/80 p-6 shadow-xl shadow-black/20 backdrop-blur-xl ${className ?? ""}`}
    >
      <h2 className="text-lg font-bold text-white">Book this tour</h2>
      <p className="mt-1 text-2xl font-bold text-emerald-400">
        BDT {tour.price.toLocaleString()}
        <span className="text-sm font-normal text-slate-400"> / person</span>
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="travelDate" className={labelClass}>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-emerald-400" />
              Travel date
            </span>
          </label>
          <input
            id="travelDate"
            type="date"
            value={travelDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => onTravelDateChange(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="guests" className={labelClass}>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-emerald-400" />
              Guests
            </span>
          </label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => onGuestsChange(Number(e.target.value))}
            className={inputClass}
          >
            {Array.from({ length: tour.maxGroupSize }, (_, i) => i + 1).map(
              (n) => (
                <option key={n} value={n}>
                  {n} guest{n !== 1 ? "s" : ""}
                </option>
              )
            )}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Maximum {tour.maxGroupSize} guests
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <div className="flex justify-between text-sm text-slate-400">
            <span>
              BDT {tour.price.toLocaleString()} × {guests}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-700 pt-2">
            <span className="font-medium text-white">Total</span>
            <span className="text-xl font-bold text-emerald-400">
              BDT {totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBook}
          disabled={isPending || authLoading}
          className="hidden min-h-14 w-full rounded-full bg-emerald-500 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 lg:block"
        >
          {isPending
            ? "Booking..."
            : isAuthenticated
              ? "Book Now"
              : "Login to Book"}
        </button>
      </div>
    </div>
  );
}
