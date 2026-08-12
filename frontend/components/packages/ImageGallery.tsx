"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Dialog from "@/components/ui/Dialog";
import { getPackageImage } from "@/lib/constants/categoryImages";
import { cn } from "@/lib/utils/cn";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useState } from "react";

type ImageGalleryProps = {
  images: string[];
  categorySlug?: string | null;
  title: string;
};

export default function ImageGallery({
  images,
  categorySlug,
  title,
}: ImageGalleryProps) {
  const resolvedImages =
    images.length > 0
      ? images
      : [getPackageImage([], categorySlug)];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % resolvedImages.length);
  }, [resolvedImages.length]);

  const goPrev = useCallback(() => {
    setActiveIndex(
      (i) => (i - 1 + resolvedImages.length) % resolvedImages.length
    );
  }, [resolvedImages.length]);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative block h-64 w-full overflow-hidden sm:h-80 md:h-96"
        >
          <ImageWithFallback
            src={resolvedImages[activeIndex]}
            categorySlug={categorySlug}
            alt={title}
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            containerClassName="absolute inset-0"
            className="transition duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </button>

        {resolvedImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto p-3">
            {resolvedImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition",
                  activeIndex === index
                    ? "border-emerald-500"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <ImageWithFallback
                  src={image}
                  categorySlug={categorySlug}
                  alt={`${title} ${index + 1}`}
                  sizes="96px"
                  containerClassName="absolute inset-0"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={title}
        className="sm:max-w-4xl"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <ImageWithFallback
            src={resolvedImages[activeIndex]}
            categorySlug={categorySlug}
            alt={title}
            sizes="100vw"
            containerClassName="absolute inset-0"
          />
          {resolvedImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setLightboxOpen(false)}
          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-700 text-sm text-slate-300"
        >
          <X className="h-4 w-4" />
          Close
        </button>
      </Dialog>
    </>
  );
}
