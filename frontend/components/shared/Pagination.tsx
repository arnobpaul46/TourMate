"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

function getPageNumbers(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (current < total - 2) pages.push("ellipsis");

  pages.push(total);
  return pages;
}

export default function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
      aria-label="Pagination"
    >
      {total !== undefined && (
        <p className="text-sm text-slate-400">
          Page {page} of {totalPages}
          {total > 0 && ` · ${total} total`}
        </p>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex min-h-10 items-center gap-1 rounded-full border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-slate-500"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              disabled={disabled}
              onClick={() => onPageChange(item)}
              className={`min-h-10 min-w-[2.25rem] rounded-full px-3 py-2 text-sm font-medium transition ${
                item === page
                  ? "bg-emerald-500 text-white"
                  : "border border-slate-700 text-slate-300 hover:bg-slate-800"
              } disabled:cursor-not-allowed disabled:opacity-50`}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex min-h-10 items-center gap-1 rounded-full border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
