import { Review } from "@/lib/api/tours";
import { Star } from "lucide-react";

type ReviewsListProps = {
  reviews: Review[];
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <h2 className="text-lg font-bold text-white">
        Reviews ({reviews.length})
      </h2>

      {reviews.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">
          No reviews yet. Be the first after completing a booking!
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-800">
          {reviews.map((review) => (
            <li key={review.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{review.user.name}</p>
                  <p className="text-xs text-slate-500">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                  <Star className="h-3 w-3 fill-current" />
                  {review.rating}
                </span>
              </div>
              {review.comment ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {review.comment}
                </p>
              ) : (
                <p className="mt-2 text-sm italic text-slate-500">
                  No written comment.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
