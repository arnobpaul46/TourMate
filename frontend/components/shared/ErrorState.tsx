import { AlertCircle } from "lucide-react";

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  message = "Failed to load data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-10 text-center">
      <AlertCircle className="h-8 w-8 text-red-400" />
      <p className="mt-3 text-sm text-red-300">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full border border-red-500/40 px-5 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
        >
          Try again
        </button>
      )}
    </div>
  );
}
