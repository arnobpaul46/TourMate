import PackageCardSkeleton from "@/components/shared/PackageCardSkeleton";
import Skeleton from "@/components/shared/Skeleton";

export default function PackagesLoading() {
  return (
    <div className="overflow-hidden bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="mt-2 h-5 w-80" />
          <Skeleton className="mt-6 h-14 w-full max-w-2xl rounded-full" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <Skeleton className="h-5 w-20" />
              <div className="mt-5 space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full rounded-full" />
                ))}
              </div>
            </div>
          </aside>
          <div className="min-w-0 flex-1">
            <PackageCardSkeleton count={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
