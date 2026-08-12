"use client";

import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: "bottom" | "right";
  className?: string;
};

export default function Sheet({
  open,
  onClose,
  title,
  children,
  side = "bottom",
  className,
}: SheetProps) {
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
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute bg-slate-900 shadow-xl shadow-black/30",
          side === "bottom" &&
            "bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-slate-800 p-6",
          side === "right" &&
            "right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto border-l border-slate-800 p-6",
          className
        )}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
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
        {children}
      </div>
    </div>
  );
}
