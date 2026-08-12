"use client";

import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative max-h-[92vh] w-full overflow-y-auto border border-slate-800 bg-slate-900 shadow-xl shadow-black/30 sm:max-w-2xl sm:rounded-2xl",
          "rounded-t-3xl sm:rounded-2xl",
          className
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/95 px-5 py-4 backdrop-blur-xl">
          {title ? (
            <h2 className="text-lg font-bold text-white">{title}</h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
