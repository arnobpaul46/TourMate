import TableSkeleton from "@/components/shared/TableSkeleton";
import Skeleton from "@/components/shared/Skeleton";

export default function AdminPackagesLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-11 w-36 rounded-full" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <TableSkeleton rows={6} />
      </div>
    </div>
  );
}
