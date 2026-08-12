import status from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../lib/prisma";
import { UpdateMeInput } from "./user.validation";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const getUsers = async () => {
  return prisma.user.findMany({
    where: { isDeleted: false },
    select: userSelect,
    orderBy: { createdAt: "desc" },
  });
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
    select: userSelect,
  });

  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }

  return user;
};

export const updateMe = async (userId: string, input: UpdateMeInput) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }

  if (input.email && input.email !== user.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: input.email,
        isDeleted: false,
        id: { not: userId },
      },
    });

    if (existingUser) {
      throw new AppError("Email is already in use", status.CONFLICT);
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.email && { email: input.email }),
    },
    select: userSelect,
  });
};
