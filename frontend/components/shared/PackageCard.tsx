"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { TourPackage } from "@/lib/api/tours";
import { Clock, MapPin, Star, Users } from "lucide-react";
import Link from "next/link";

type PackageCardProps = {
  tour: TourPackage;
};

export default function PackageCard({ tour }: PackageCardProps) {
  const durationLabel =
    typeof tour.duration === "number"
      ? `${tour.duration} Day${tour.duration !== 1 ? "s" : ""}`
      : String(tour.duration);

  return (
    <Link
      href={`/packages/${tour.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-xl shadow-black/20 backdrop-blur transition-all hover:border-emerald-800/50 hover:shadow-emerald-900/20"
    >
      <div className="relative h-56 overflow-hidden sm:h-64">
        <ImageWithFallback
          src={tour.images?.[0]}
          categorySlug={tour.category?.slug}
          alt={tour.title}
          sizes="(max-width: 768px) 100vw, 33vw"
          containerClassName="absolute inset-0"
          className="transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
        <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {durationLabel}
        </span>
        {tour.category && (
          <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            {tour.category.name}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-300">
            {tour.title}
          </h3>
          {tour.avgRating !== undefined && tour.avgRating > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-300">
              <Star className="h-3 w-3 fill-current" />
              {tour.avgRating}
            </span>
          )}
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
          <MapPin className="h-4 w-4 shrink-0 text-emerald-400" />
          {tour.location}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {durationLabel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            Max {tour.maxGroupSize}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-700/50 pt-4">
          <p className="text-xl font-bold text-emerald-400">
            BDT {tour.price.toLocaleString()}
          </p>
          <span className="text-sm font-semibold text-emerald-400 transition group-hover:text-white">
            Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
