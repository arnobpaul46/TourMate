"use client";

import Dialog from "@/components/ui/Dialog";
import { createReview } from "@/lib/api/reviews";
import { labelClass, textareaClass } from "@/lib/constants/formStyles";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type ReviewModalProps = {
  tourPackageId: string;
  packageTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ReviewModal({
  tourPackageId,
  packageTitle,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: (data) => {
      toast.success(data.message || "Review submitted successfully");
      setRating(5);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["tour-packages"] });
      queryClient.invalidateQueries({
        queryKey: ["tour-package", tourPackageId],
      });
      onSuccess();
      onClose();
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
    <Dialog open={isOpen} onClose={onClose} title="Add Review">
      <p className="mb-4 text-sm text-slate-400">{packageTitle}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
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
                >
                  <Star
                    className={`h-6 w-6 ${
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

        <div>
          <label htmlFor="comment" className={labelClass}>
            Comment (optional)
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className={textareaClass}
            placeholder="Share your experience..."
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 flex-1 rounded-full border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={reviewMutation.isPending}
            className="min-h-11 flex-1 rounded-full bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
          >
            {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
