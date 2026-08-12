"use client";

import Skeleton from "@/components/shared/Skeleton";
import { Category } from "@/lib/api/tours";
import { cn } from "@/lib/utils/cn";
import {
  MapPin,
  Mountain,
  Palmtree,
  TreePine,
  Waves,
} from "lucide-react";

export type PackageFiltersState = {
  categoryId: string;
  categorySlug: string;
  minPrice: number;
  maxPrice: number;
  duration: number | null;
  location: string;
};

type PackageFiltersPanelProps = {
  categories: Category[] | undefined;
  categoriesLoading: boolean;
  filters: PackageFiltersState;
  priceDraft: { minPrice: number; maxPrice: number };
  locations: string[];
  onCategoryToggle: (categoryId: string, categorySlug: string) => void;
  onPriceDraftChange: (draft: { minPrice: number; maxPrice: number }) => void;
  onDurationChange: (duration: number | null) => void;
  onLocationChange: (location: string) => void;
  onApply: () => void;
  onClear: () => void;
  className?: string;
};

const categoryIcons: Record<string, typeof Waves> = {
  beach: Waves,
  hill: Mountain,
  forest: TreePine,
  historical: MapPin,
  "haor-lake": Waves,
  "city-tour": MapPin,
};

export default function PackageFiltersPanel({
  categories,
  categoriesLoading,
  filters,
  priceDraft,
  locations,
  onCategoryToggle,
  onPriceDraftChange,
  onDurationChange,
  onLocationChange,
  onApply,
  onClear,
  className,
}: PackageFiltersPanelProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-sm font-semibold text-white">Category</h3>
        {categoriesLoading ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onCategoryToggle("", "")}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                !filters.categoryId && !filters.categorySlug
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
              )}
            >
              All
            </button>
            {categories?.map((category) => {
              const Icon = categoryIcons[category.slug] ?? Palmtree;
              const active =
                filters.categoryId === category.id ||
                filters.categorySlug === category.slug;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryToggle(category.id, category.slug)}
                  className={cn(
                    "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    active
                      ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                      : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {category.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Price range (BDT)</h3>
          <span className="text-xs text-slate-400">
            {priceDraft.minPrice.toLocaleString()} –{" "}
            {priceDraft.maxPrice.toLocaleString()}
          </span>
        </div>
        <div className="mt-3 space-y-3">
          <input
            type="range"
            min={0}
            max={20000}
            step={500}
            value={priceDraft.minPrice}
            onChange={(e) =>
              onPriceDraftChange({
                ...priceDraft,
                minPrice: Math.min(Number(e.target.value), priceDraft.maxPrice),
              })
            }
            className="w-full accent-emerald-500"
          />
          <input
            type="range"
            min={0}
            max={20000}
            step={500}
            value={priceDraft.maxPrice}
            onChange={(e) =>
              onPriceDraftChange({
                ...priceDraft,
                maxPrice: Math.max(Number(e.target.value), priceDraft.minPrice),
              })
            }
            className="w-full accent-emerald-500"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Duration (days)</h3>
          <span className="text-xs text-slate-400">
            {filters.duration ? `${filters.duration} days` : "Any"}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={filters.duration ?? 1}
          onChange={(e) => onDurationChange(Number(e.target.value))}
          className="mt-3 w-full accent-emerald-500"
        />
        <button
          type="button"
          onClick={() => onDurationChange(null)}
          className="mt-2 text-xs text-emerald-400 hover:text-emerald-300"
        >
          Clear duration
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">Location</h3>
        <select
          value={filters.location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="mt-3 h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none focus:border-emerald-500"
        >
          <option value="">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <button
          type="button"
          onClick={onApply}
          className="min-h-11 w-full rounded-full bg-emerald-500 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95"
        >
          Apply filters
        </button>
        <button
          type="button"
          onClick={onClear}
          className="min-h-11 w-full rounded-full border border-slate-700 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
