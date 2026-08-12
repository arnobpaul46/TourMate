import status from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../lib/prisma";
import { generateSlug } from "../../utils/slug";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.validation";

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  createdAt: true,
  updatedAt: true,
};

const ensureUniqueSlug = async (name: string, excludeId?: string) => {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

export const createCategory = async (input: CreateCategoryInput) => {
  const slug = await ensureUniqueSlug(input.name);

  return prisma.category.create({
    data: {
      name: input.name,
      slug,
      description: input.description,
    },
    select: categorySelect,
  });
};

export const getAllCategories = async () => {
  try {
    return await prisma.category.findMany({
      where: { isDeleted: false },
      select: categorySelect,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.log("getAllCategories error:", error);
    throw error;
  }
};

/** @deprecated Use getAllCategories */
export const getCategories = getAllCategories;

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: { id, isDeleted: false },
    select: categorySelect,
  });

  if (!category) {
    throw new AppError("Category not found", status.NOT_FOUND);
  }

  return category;
};

export const updateCategory = async (id: string, input: UpdateCategoryInput) => {
  const category = await prisma.category.findFirst({
    where: { id, isDeleted: false },
  });

  if (!category) {
    throw new AppError("Category not found", status.NOT_FOUND);
  }

  const slug = input.name ? await ensureUniqueSlug(input.name, id) : undefined;

  return prisma.category.update({
    where: { id },
    data: {
      ...(input.name && { name: input.name, slug }),
      ...(input.description !== undefined && { description: input.description }),
    },
    select: categorySelect,
  });
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: { id, isDeleted: false },
  });

  if (!category) {
    throw new AppError("Category not found", status.NOT_FOUND);
  }

  return prisma.category.update({
    where: { id },
    data: { isDeleted: true },
    select: categorySelect,
  });
};
