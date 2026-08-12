import { BookingStatus } from "@/lib/api/bookings";
import { cn } from "@/lib/utils/cn";

const statusStyles: Record<BookingStatus, string> = {
  PENDING: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  CONFIRMED: "border-blue-500/30 bg-blue-500/15 text-blue-300",
  CANCELLED: "border-red-500/30 bg-red-500/15 text-red-300",
  COMPLETED: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
