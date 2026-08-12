import Skeleton from "@/components/shared/Skeleton";

export default function PackageDetailLoading() {
  return (
    <div className="overflow-hidden bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <Skeleton className="h-64 rounded-2xl sm:h-80 md:h-96" />
            <Skeleton className="mt-4 h-16 rounded-2xl" />
            <Skeleton className="mt-6 h-8 w-2/3" />
            <Skeleton className="mt-4 h-5 w-1/2" />
            <Skeleton className="mt-6 h-40 rounded-2xl" />
          </div>
          <aside className="hidden lg:block">
            <Skeleton className="h-80 rounded-2xl" />
          </aside>
        </div>
      </div>
    </div>
  );
}
