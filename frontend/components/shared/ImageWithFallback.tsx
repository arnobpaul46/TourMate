"use client";

import { getPackageImage } from "@/lib/constants/categoryImages";
import { cn } from "@/lib/utils/cn";
import { Mountain } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type ImageWithFallbackProps = {
  src?: string | null;
  categorySlug?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  containerClassName?: string;
};

export default function ImageWithFallback({
  src,
  categorySlug,
  alt,
  className,
  fill = true,
  priority = false,
  sizes = "100vw",
  containerClassName,
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = failed
    ? getPackageImage([], categorySlug)
    : src || getPackageImage([], categorySlug);

  if (failed && !imageSrc) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600",
          containerClassName,
          className
        )}
      >
        <Mountain className="h-10 w-10 text-white/80" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        onError={() => setFailed(true)}
        className={cn("object-cover", className)}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  );
}
