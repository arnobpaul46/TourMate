import { Prisma } from "../../generated/prisma/client";
import status from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../lib/prisma";
import {
  CreateTourPackageInput,
  GetTourPackagesQuery,
  UpdateTourPackageInput,
} from "./tourPackage.validation";

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
};

const tourPackageSelect = {
  id: true,
  title: true,
  description: true,
  location: true,
  price: true,
  duration: true,
  maxGroupSize: true,
  images: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
};

const CATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  hill: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
  forest: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  historical:
    "https://images.unsplash.com/photo-1461360228755-6e81c478b882",
  "haor-lake":
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000",
  "city-tour":
    "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb",
};

const DEFAULT_PACKAGE_IMAGE = CATEGORY_IMAGE_FALLBACKS.beach;

const resolvePackageImages = (
  images: string[] | null | undefined,
  categorySlug?: string | null
): string[] => {
  const validImages = (images ?? []).filter((url) => url.trim().length > 0);
  if (validImages.length > 0) return validImages;

  const fallback =
    (categorySlug && CATEGORY_IMAGE_FALLBACKS[categorySlug]) ||
    DEFAULT_PACKAGE_IMAGE;

  return [fallback];
};

const withResolvedImages = <
  T extends {
    images: string[];
    category?: { slug: string } | null;
  },
>(
  tourPackage: T
) => ({
  ...tourPackage,
  images: resolvePackageImages(tourPackage.images, tourPackage.category?.slug),
});

const ensureCategoryExists = async (categoryId: string) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, isDeleted: false },
  });

  if (!category) {
    throw new AppError("Category not found", status.NOT_FOUND);
  }
};

const buildWhereClause = (query: GetTourPackagesQuery): Prisma.TourPackageWhereInput => {
  const where: Prisma.TourPackageWhereInput = {
    isDeleted: false,
  };

  if (query.searchTerm) {
    where.OR = [
      {
        title: { contains: query.searchTerm, mode: "insensitive" },
      },
      {
        location: { contains: query.searchTerm, mode: "insensitive" },
      },
      {
        description: { contains: query.searchTerm, mode: "insensitive" },
      },
    ];
  }

  if (query.category) {
    where.category = {
      slug: query.category,
      isDeleted: false,
    };
  } else if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {
      ...(query.minPrice !== undefined && { gte: query.minPrice }),
      ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
    };
  }

  return where;
};

const formatTourPackageListItem = <
  T extends {
    images: string[];
    category?: { slug: string } | null;
    reviews: { rating: number }[];
    _count: { reviews: number };
  },
>(
  tourPackage: T
) => {
  const { reviews, _count, ...rest } = tourPackage;
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return {
    ...rest,
    reviewCount: _count.reviews,
    avgRating: Number(avgRating.toFixed(2)),
    images: resolvePackageImages(rest.images, rest.category?.slug),
  };
};

export const createTourPackage = async (input: CreateTourPackageInput) => {
  await ensureCategoryExists(input.categoryId);

  // slug generate - DB te slug required
  const slug = input.slug || input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4);
  
  return withResolvedImages(
    await prisma.tourPackage.create({
      data: {
        title: input.title,
        slug: slug,
        description: input.description,
        location: input.location,
        price: Number(input.price),
        duration: Number(input.duration), // tomar DB te duration integer, string na
        maxGroupSize: Number(input.maxGroupSize),
        images: input.images ?? [],
        categoryId: input.categoryId,
        isDeleted: false,
      },
      select: {
        ...tourPackageSelect,
        category: { select: categorySelect },
      },
    })
  );
};

export const getTourPackages = async (query: GetTourPackagesQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = buildWhereClause({ ...query, page, limit });

  const [tourPackages, total] = await Promise.all([
    prisma.tourPackage.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [query.sortBy]: query.sortOrder },
      select: {
        ...tourPackageSelect,
        category: { select: categorySelect },
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.tourPackage.count({ where }),
  ]);

  return {
    data: tourPackages.map(formatTourPackageListItem),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTourPackageById = async (id: string) => {
  const tourPackage = await prisma.tourPackage.findFirst({
    where: { id, isDeleted: false },
    select: {
      ...tourPackageSelect,
      category: { select: categorySelect },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!tourPackage) {
    throw new AppError("Tour package not found", status.NOT_FOUND);
  }

  return withResolvedImages(tourPackage);
};

export const updateTourPackage = async (
  id: string,
  input: UpdateTourPackageInput
) => {
  const tourPackage = await prisma.tourPackage.findFirst({
    where: { id, isDeleted: false },
  });

  if (!tourPackage) {
    throw new AppError("Tour package not found", status.NOT_FOUND);
  }

  if (input.categoryId) {
    await ensureCategoryExists(input.categoryId);
  }

  return withResolvedImages(
    await prisma.tourPackage.update({
      where: { id },
      data: input,
      select: {
        ...tourPackageSelect,
        category: { select: categorySelect },
      },
    })
  );
};

export const deleteTourPackage = async (id: string) => {
  const tourPackage = await prisma.tourPackage.findFirst({
    where: { id, isDeleted: false },
  });

  if (!tourPackage) {
    throw new AppError("Tour package not found", status.NOT_FOUND);
  }

  return withResolvedImages(
    await prisma.tourPackage.update({
      where: { id },
      data: { isDeleted: true },
      select: {
        ...tourPackageSelect,
        category: { select: categorySelect },
      },
    })
  );
};
