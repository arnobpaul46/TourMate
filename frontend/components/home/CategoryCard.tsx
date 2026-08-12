"use client";

import { Category } from "@/lib/api/tours";
import { getCategoryImage } from "@/lib/constants/categoryImages";
import {
  Building2,
  Landmark,
  LucideIcon,
  Mountain,
  Sailboat,
  Trees,
  Waves,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const categoryIcons: Record<string, LucideIcon> = {
  beach: Waves,
  hill: Mountain,
  forest: Trees,
  historical: Landmark,
  "haor-lake": Sailboat,
  "city-tour": Building2,
};

type CategoryCardProps = {
  category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();
  const Icon = categoryIcons[category.slug] ?? Waves;
  const fallback = getCategoryImage(category.slug);
  const [imgSrc, setImgSrc] = useState(fallback);

  return (
    <button
      type="button"
      onClick={() => router.push(`/packages?category=${category.slug}`)}
      className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 text-left transition hover:scale-105 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/20"
    >
      <div className="relative h-24 w-full overflow-hidden sm:h-28">
        <Image
          src={imgSrc}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, 16vw"
          className="object-cover transition duration-700 group-hover:scale-110"
          onError={() => setImgSrc(getCategoryImage("beach"))}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <div className="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 backdrop-blur-md">
          <Icon className="h-4 w-4 text-emerald-300" />
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-sm font-bold text-white sm:text-base">
          {category.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-400 sm:text-sm">
          {category.description || "Explore curated tours"}
        </p>
      </div>
    </button>
  );
}
