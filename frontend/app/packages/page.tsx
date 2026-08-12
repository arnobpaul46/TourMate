"use client";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import PackageCard from "@/components/shared/PackageCard";
import PackageCardSkeleton from "@/components/shared/PackageCardSkeleton";
import Pagination from "@/components/shared/Pagination";
import PackageFiltersPanel, {
  PackageFiltersState,
} from "@/components/packages/PackageFiltersPanel";
import Sheet from "@/components/ui/Sheet";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryToastError } from "@/hooks/useQueryToastError";
import {
  fetchCategories,
  fetchTourPackages,
  TourPackagesQuery,
} from "@/lib/api/tours";
import { useQuery } from "@tanstack/react-query";
import { Package, Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_LIMIT = 9;

type Filters = PackageFiltersState & {
  searchTerm: string;
  page: number;
};

function filtersFromParams(params: URLSearchParams): Filters {
  return {
    searchTerm: params.get("searchTerm") ?? params.get("search") ?? "",
    categoryId: params.get("categoryId") ?? "",
    categorySlug: params.get("category") ?? "",
    minPrice: Number(params.get("minPrice") ?? 0),
    maxPrice: Number(params.get("maxPrice") ?? 20000),
    duration: params.get("duration") ? Number(params.get("duration")) : null,
    location: params.get("location") ?? "",
    page: Number(params.get("page") ?? 1),
  };
}

function toQueryParams(filters: Filters, searchTerm: string): TourPackagesQuery {
  const query: TourPackagesQuery = {
    page: filters.page,
    limit: DEFAULT_LIMIT,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  if (searchTerm.trim()) query.searchTerm = searchTerm.trim();
  if (filters.categoryId) query.categoryId = filters.categoryId;
  if (filters.categorySlug) query.category = filters.categorySlug;
  if (filters.minPrice > 0) query.minPrice = filters.minPrice;
  if (filters.maxPrice < 20000) query.maxPrice = filters.maxPrice;

  return query;
}

export default function PackagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>(() =>
    filtersFromParams(searchParams)
  );
  const [searchInput, setSearchInput] = useState(
    () => filtersFromParams(searchParams).searchTerm
  );
  const [priceDraft, setPriceDraft] = useState({
    minPrice: filtersFromParams(searchParams).minPrice,
    maxPrice: filtersFromParams(searchParams).maxPrice,
  });
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    const next = filtersFromParams(searchParams);
    setFilters(next);
    setSearchInput(next.searchTerm);
    setPriceDraft({ minPrice: next.minPrice, maxPrice: next.maxPrice });
  }, [searchParams]);

  const syncUrl = useCallback(
    (next: Filters, searchTerm: string) => {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
      if (next.categoryId) params.set("categoryId", next.categoryId);
      if (next.categorySlug) params.set("category", next.categorySlug);
      if (next.minPrice > 0) params.set("minPrice", String(next.minPrice));
      if (next.maxPrice < 20000) params.set("maxPrice", String(next.maxPrice));
      if (next.duration) params.set("duration", String(next.duration));
      if (next.location) params.set("location", next.location);
      if (next.page > 1) params.set("page", String(next.page));

      const query = params.toString();
      router.replace(`/packages${query ? `?${query}` : ""}`, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    setFilters((current) => {
      if (current.searchTerm === debouncedSearch) return current;
      const next = { ...current, searchTerm: debouncedSearch, page: 1 };
      syncUrl(next, debouncedSearch);
      return next;
    });
  }, [debouncedSearch, syncUrl]);

  const queryParams = useMemo(
    () => toQueryParams(filters, debouncedSearch),
    [filters, debouncedSearch]
  );

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const packagesQuery = useQuery({
    queryKey: ["tour-packages", queryParams],
    queryFn: () => fetchTourPackages(queryParams),
  });

  const locationsQuery = useQuery({
    queryKey: ["tour-packages", "locations"],
    queryFn: () => fetchTourPackages({ limit: 100 }),
  });

  const locations = useMemo(() => {
    const set = new Set<string>();
    locationsQuery.data?.data.forEach((pkg) => {
      if (pkg.location) set.add(pkg.location);
    });
    return Array.from(set).sort();
  }, [locationsQuery.data]);

  useQueryToastError(
    packagesQuery.isError,
    packagesQuery.error,
    "Failed to load packages."
  );

  const filteredPackages = useMemo(() => {
    let list = packagesQuery.data?.data ?? [];
    if (filters.duration) {
      list = list.filter((pkg) => pkg.duration === filters.duration);
    }
    if (filters.location) {
      list = list.filter((pkg) => pkg.location === filters.location);
    }
    return list;
  }, [packagesQuery.data, filters.duration, filters.location]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = { ...filters, searchTerm: searchInput, page: 1 };
    setFilters(next);
    syncUrl(next, searchInput);
  };

  const applyCategory = (categoryId: string, categorySlug: string) => {
    const isSame =
      filters.categoryId === categoryId && filters.categorySlug === categorySlug;
    const next = {
      ...filters,
      categoryId: isSame ? "" : categoryId,
      categorySlug: isSame ? "" : categorySlug,
      page: 1,
    };
    setFilters(next);
    syncUrl(next, debouncedSearch);
  };

  const applyFilters = () => {
    const next = {
      ...filters,
      minPrice: priceDraft.minPrice,
      maxPrice: priceDraft.maxPrice,
      page: 1,
    };
    setFilters(next);
    syncUrl(next, debouncedSearch);
    setFilterSheetOpen(false);
  };

  const clearFilters = () => {
    const next: Filters = {
      searchTerm: "",
      categoryId: "",
      categorySlug: "",
      minPrice: 0,
      maxPrice: 20000,
      duration: null,
      location: "",
      page: 1,
    };
    setFilters(next);
    setSearchInput("");
    setPriceDraft({ minPrice: 0, maxPrice: 20000 });
    router.replace("/packages", { scroll: false });
    setFilterSheetOpen(false);
  };

  const filterPanelProps = {
    categories: categoriesQuery.data,
    categoriesLoading: categoriesQuery.isLoading,
    filters,
    priceDraft,
    locations,
    onCategoryToggle: applyCategory,
    onPriceDraftChange: setPriceDraft,
    onDurationChange: (duration: number | null) =>
      setFilters((current) => ({ ...current, duration })),
    onLocationChange: (location: string) =>
      setFilters((current) => ({ ...current, location })),
    onApply: applyFilters,
    onClear: clearFilters,
  };

  const meta = packagesQuery.data?.meta;
  const isLoading = packagesQuery.isLoading || packagesQuery.isFetching;

  return (
    <div className="overflow-hidden bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Explore Packages
          </h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Find your next adventure across Bangladesh
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by title or location..."
                className="h-14 w-full rounded-full border border-white/20 bg-white/10 pl-12 pr-4 text-white backdrop-blur-xl outline-none placeholder:text-slate-400 focus:border-emerald-500/50"
              />
            </div>
            <button
              type="submit"
              className="min-h-14 rounded-full bg-emerald-500 px-8 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95 sm:w-auto"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-slate-700 px-6 text-sm font-medium text-slate-300 transition hover:bg-slate-800 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
              <h2 className="text-lg font-bold text-white">Filters</h2>
              <div className="mt-5">
                <PackageFiltersPanel {...filterPanelProps} />
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {isLoading ? (
              <PackageCardSkeleton count={6} />
            ) : packagesQuery.isError ? (
              <ErrorState
                message="Failed to load packages. Please try again."
                onRetry={() => packagesQuery.refetch()}
              />
            ) : filteredPackages.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No packages found"
                description="Try adjusting your search or filters to find tour packages."
                actionLabel="Clear filters"
                onAction={clearFilters}
              />
            ) : (
              <>
                <p className="mb-6 text-sm text-slate-400">
                  Showing {filteredPackages.length} of {meta?.total ?? 0}{" "}
                  packages
                </p>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredPackages.map((tour) => (
                    <PackageCard key={tour.id} tour={tour} />
                  ))}
                </div>

                {meta && (
                  <Pagination
                    page={meta.page}
                    totalPages={meta.totalPages}
                    total={meta.total}
                    disabled={packagesQuery.isFetching}
                    onPageChange={(page) => {
                      const next = { ...filters, page };
                      setFilters(next);
                      syncUrl(next, debouncedSearch);
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Sheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        side="bottom"
        title="Filters"
      >
        <PackageFiltersPanel {...filterPanelProps} />
      </Sheet>
    </div>
  );
}
