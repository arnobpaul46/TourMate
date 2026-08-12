import TableSkeleton from "@/components/shared/TableSkeleton";
import Skeleton from "@/components/shared/Skeleton";

export default function AdminBookingsLoading() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <TableSkeleton rows={6} />
      </div>
    </div>
  );
}
