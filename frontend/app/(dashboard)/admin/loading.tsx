import Skeleton from "@/components/shared/Skeleton";

export default function AdminDashboardLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="mt-8 h-64 rounded-2xl" />
    </div>
  );
}
