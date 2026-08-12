import { z } from "zod";

const tourPackageBodySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  price: z.number().positive("Price must be greater than 0"),
  duration: z.number().int().positive("Duration must be greater than 0"),
  maxGroupSize: z.number().int().positive("Max group size must be greater than 0"),
  categoryId: z.string().uuid("Invalid category id"),
  images: z.array(z.string().url("Each image must be a valid URL")).default([]),
});

export const createTourPackageSchema = tourPackageBodySchema;

export const updateTourPackageSchema = tourPackageBodySchema.partial();

export const tourPackageIdSchema = z.object({
  id: z.string().uuid("Invalid tour package id"),
});

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null || value === undefined ? undefined : value;

const normalizeTourPackagesQuery = (raw: unknown) => {
  const query = (raw ?? {}) as Record<string, unknown>;

  return {
    searchTerm: query.searchTerm ?? query.search,
    categoryId: query.categoryId,
    category: query.category,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    page: query.page,
    limit: query.limit,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  };
};

export const getTourPackagesQuerySchema = z.preprocess(
  normalizeTourPackagesQuery,
  z.object({
    searchTerm: z.preprocess(emptyToUndefined, z.string().optional()),
    categoryId: z.preprocess(emptyToUndefined, z.string().uuid().optional()),
    category: z.preprocess(emptyToUndefined, z.string().optional()),
    minPrice: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
    maxPrice: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).optional().default(10),
    sortBy: z
      .enum(["price", "createdAt", "title", "duration"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  })
);

export type CreateTourPackageInput = z.infer<typeof createTourPackageSchema>;
export type UpdateTourPackageInput = z.infer<typeof updateTourPackageSchema>;
export type GetTourPackagesQuery = z.infer<typeof getTourPackagesQuerySchema>;
