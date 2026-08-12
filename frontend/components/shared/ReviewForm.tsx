"use client";

import { createReview } from "@/lib/api/reviews";
import { textareaClass, labelClass } from "@/lib/constants/formStyles";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type ReviewFormProps = {
  tourPackageId: string;
  onSuccess?: () => void;
};

export default function ReviewForm({
  tourPackageId,
  onSuccess,
}: ReviewFormProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: (data) => {
      toast.success(data.message || "Review submitted successfully");
      setRating(5);
      setComment("");
      queryClient.invalidateQueries({
        queryKey: ["tour-package", tourPackageId],
      });
      queryClient.invalidateQueries({ queryKey: ["tour-packages"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to submit review."));
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    reviewMutation.mutate({
      tourPackageId,
      rating,
      comment: comment.trim() || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5"
    >
      <h3 className="font-bold text-white">Write a review</h3>
      <p className="mt-1 text-sm text-slate-400">
        Share your experience after completing this tour.
      </p>

      <div className="mt-4">
        <label className={labelClass}>Rating</label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="rounded p-1 transition hover:scale-110"
                aria-label={`Rate ${value} stars`}
              >
                <Star
                  className={`h-7 w-7 ${
                    value <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-600"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="review-comment" className={labelClass}>
          Comment (optional)
        </label>
        <textarea
          id="review-comment"
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className={textareaClass}
          placeholder="What did you enjoy about this tour?"
        />
      </div>

      <button
        type="submit"
        disabled={reviewMutation.isPending}
        className="mt-4 min-h-11 rounded-full bg-emerald-500 px-6 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
