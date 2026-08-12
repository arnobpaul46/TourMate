"use client";

import CategoryCard from "@/components/home/CategoryCard";
import FadeIn from "@/components/home/FadeIn";
import FeaturedPackageCard from "@/components/home/FeaturedPackageCard";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import PackageCardSkeleton from "@/components/shared/PackageCardSkeleton";
import Skeleton from "@/components/shared/Skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryToastError } from "@/hooks/useQueryToastError";
import { heroImage } from "@/lib/constants/categoryImages";
import {
  fetchCategories,
  fetchFeaturedTours,
  fetchTourPackages,
} from "@/lib/api/tours";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  Compass,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Trusted Bookings",
    description:
      "Secure reservations with transparent pricing and verified tour operators.",
  },
  {
    icon: Star,
    title: "Real Reviews",
    description:
      "Read authentic feedback from travelers who completed their tours.",
  },
  {
    icon: Users,
    title: "Expert Curation",
    description:
      "Packages organized by category with detailed itineraries and group sizes.",
  },
  {
    icon: BadgeCheck,
    title: "Easy Management",
    description:
      "Track bookings, update profiles, and manage tours from one dashboard.",
  },
];

const heroStats = [
  { icon: Compass, label: "500+ Tours" },
  { icon: Users, label: "10k+ Travelers" },
  { icon: Star, label: "4.9 Rating" },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const featuredQuery = useQuery({
    queryKey: ["tour-packages", "featured", 6],
    queryFn: () => fetchFeaturedTours(6),
  });

  const hasActiveSearch = debouncedSearch.trim().length > 0;

  const searchResultsQuery = useQuery({
    queryKey: ["tour-packages", "search", debouncedSearch],
    queryFn: () =>
      fetchTourPackages({
        searchTerm: debouncedSearch.trim(),
        limit: 12,
      }),
    enabled: hasActiveSearch,
  });

  useQueryToastError(
    categoriesQuery.isError,
    categoriesQuery.error,
    "Failed to load categories."
  );
  useQueryToastError(
    featuredQuery.isError,
    featuredQuery.error,
    "Failed to load featured tours."
  );

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      router.push("/packages");
      return;
    }
    router.push(`/packages?search=${encodeURIComponent(trimmed)}`);
  };

  const categories = categoriesQuery.data ?? [];
  const featuredPackages = featuredQuery.data ?? [];

  return (
    <div className="overflow-x-hidden bg-slate-950">
      {/* Hero */}
      <section className="relative isolate min-h-[85vh] overflow-hidden md:min-h-[88vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Bangladesh travel destination"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-slate-950/60" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-emerald-900/25 via-transparent to-slate-950/70" />

        <div className="relative z-20 mx-auto flex min-h-[85vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8 md:min-h-[88vh]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 sm:text-sm">
            Bangladesh · Travel · Adventure
          </p>
          <h1 className="max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Discover unforgettable tour packages across Bangladesh
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-200 sm:mt-6 sm:text-base md:text-lg">
            Search by destination or tour name, browse categories, and book your
            perfect getaway with TourMate.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-3xl border border-white/20 bg-white/10 p-3 backdrop-blur-xl sm:mt-10 sm:flex-row sm:items-center sm:rounded-full sm:p-2"
          >
            <div className="relative w-full flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-200 sm:left-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tours or locations..."
                className="h-14 w-full rounded-2xl bg-white/5 py-3.5 pl-12 pr-4 text-base text-white placeholder:text-slate-300 outline-none sm:rounded-full sm:bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="h-14 w-full min-w-[44px] rounded-full bg-emerald-500 px-8 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95 sm:w-auto"
            >
              Search
            </button>
          </form>

          <div className="mt-10 hidden flex-wrap justify-center gap-4 md:flex">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md"
              >
                <stat.icon className="h-4 w-4 text-emerald-300" />
                {stat.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live search results */}
      {hasActiveSearch && (
        <section className="border-b border-slate-800 bg-slate-950 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Search Results</h2>
              {searchResultsQuery.isFetching && (
                <span className="text-sm text-slate-400">Searching...</span>
              )}
            </div>

            {searchResultsQuery.isLoading ? (
              <PackageCardSkeleton count={6} />
            ) : searchResultsQuery.isError ? (
              <ErrorState
                message="Failed to search packages."
                onRetry={() => searchResultsQuery.refetch()}
              />
            ) : searchResultsQuery.data?.data.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No packages found"
                description="Try a different search term."
                actionLabel="View all packages"
                actionHref="/packages"
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResultsQuery.data?.data.map((tour) => (
                  <FeaturedPackageCard key={tour.id} tour={tour} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Explore by style
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              Browse Categories
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              From sun-kissed beaches to misty hills — find your perfect
              Bangladesh adventure.
            </p>
          </FadeIn>

          {categoriesQuery.isLoading ? (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-56 rounded-2xl" />
              ))}
            </div>
          ) : categoriesQuery.isError ? (
            <div className="mt-10">
              <ErrorState
                message="Failed to load categories."
                onRetry={() => categoriesQuery.refetch()}
              />
            </div>
          ) : categories.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                icon={MapPin}
                title="No categories yet"
                description="Categories will appear here once added."
                actionLabel="Browse packages"
                actionHref="/packages"
              />
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-slate-900 px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                  Hand-picked for you
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                  Featured Packages
                </h2>
                <p className="mt-3 text-slate-300">
                  Premium tours curated by local experts across Bangladesh.
                </p>
              </div>
              <Link
                href="/packages"
                className="hidden rounded-full border border-emerald-500/30 px-5 py-2.5 text-sm font-semibold text-emerald-400 transition hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-white sm:inline-flex"
              >
                View all →
              </Link>
            </div>
          </FadeIn>

          {featuredQuery.isLoading ? (
            <div className="mt-10">
              <PackageCardSkeleton count={6} />
            </div>
          ) : featuredQuery.isError ? (
            <div className="mt-10">
              <ErrorState
                message="Failed to load featured tours."
                onRetry={() => featuredQuery.refetch()}
              />
            </div>
          ) : featuredPackages.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                icon={MapPin}
                title="No tour packages yet"
                description="Check back soon for featured travel packages."
                actionLabel="Browse all packages"
                actionHref="/packages"
              />
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredPackages.slice(0, 6).map((tour) => (
                <FeaturedPackageCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/packages"
              className="inline-flex min-h-11 items-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95"
            >
              View all packages
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-950 px-4 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Why TourMate
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              Why Choose Us
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              TourMate combines curated packages, secure bookings, and community
              reviews to help you travel smarter across Bangladesh.
            </p>
          </FadeIn>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.06}>
                <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-6 text-center backdrop-blur transition hover:border-emerald-800/40 hover:shadow-lg hover:shadow-emerald-900/10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20">
                    <item.icon className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
