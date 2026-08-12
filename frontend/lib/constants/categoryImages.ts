export const categoryImages: Record<string, string> = {
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  hill: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
  forest: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
  historical:
    "https://images.unsplash.com/photo-1524231757912-849822473237?auto=format&fit=crop&w=800&q=80",
  "haor-lake":
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80",
  "city-tour":
    "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=800&q=80",
};

export const heroImage =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80";

export function getCategoryImage(slug?: string | null) {
  if (!slug) return categoryImages.beach;
  return categoryImages[slug] ?? categoryImages.beach;
}

export function getPackageImage(
  images: string[] | undefined,
  categorySlug?: string | null
) {
  if (images?.[0]) return images[0];
  return getCategoryImage(categorySlug);
}
