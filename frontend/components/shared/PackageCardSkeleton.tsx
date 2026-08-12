import Skeleton from "@/components/shared/Skeleton";

type PackageCardSkeletonProps = {
  count?: number;
};

export default function PackageCardSkeleton({ count = 6 }: PackageCardSkeletonProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50"
        >
          <Skeleton className="h-64 w-full rounded-none bg-slate-700" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-3/4 bg-slate-700" />
            <Skeleton className="h-4 w-1/2 bg-slate-700" />
            <Skeleton className="h-4 w-2/3 bg-slate-700" />
            <Skeleton className="h-6 w-1/3 bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
