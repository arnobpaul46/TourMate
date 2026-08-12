import Skeleton from "@/components/shared/Skeleton";

type TableSkeletonProps = {
  rows?: number;
};

export default function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className="p-6">
      <div className="mb-4 flex gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-24" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
