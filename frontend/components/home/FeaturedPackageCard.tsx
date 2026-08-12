"use client";

import { getPackageImage } from "@/lib/constants/categoryImages";
import { TourPackage } from "@/lib/api/tours";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type FeaturedPackageCardProps = {
  tour: TourPackage;
};

export default function FeaturedPackageCard({ tour }: FeaturedPackageCardProps) {
  const [imgSrc, setImgSrc] = useState(() =>
    getPackageImage(tour.images, tour.category?.slug)
  );

  const durationLabel =
    typeof tour.duration === "number"
      ? `${tour.duration} Day${tour.duration !== 1 ? "s" : ""}`
      : String(tour.duration);

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-xl transition hover:border-emerald-500/40">
      <div className="relative h-56 overflow-hidden md:h-64">
        <Image
          src={imgSrc}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-110"
          onError={() =>
            setImgSrc(getPackageImage([], tour.category?.slug))
          }
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <span className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {durationLabel}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white">{tour.title}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
          <MapPin className="h-4 w-4 shrink-0 text-emerald-400" />
          {tour.location}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-emerald-400">
            BDT {tour.price.toLocaleString()}
          </span>
          <Link
            href={`/packages/${tour.id}`}
            className="text-sm font-semibold text-emerald-400 transition hover:text-white"
          >
            Details →
          </Link>
        </div>
      </div>
    </article>
  );
}
