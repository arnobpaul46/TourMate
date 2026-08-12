import status from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../lib/prisma";
import { CreateReviewInput, GetReviewsQuery } from "./review.validation";

const userSelect = {
  id: true,
  name: true,
  email: true,
};

const reviewSelect = {
  id: true,
  rating: true,
  comment: true,
  tourPackageId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
};

export const createReview = async (userId: string, input: CreateReviewInput) => {
  const tourPackage = await prisma.tourPackage.findFirst({
    where: { id: input.tourPackageId, isDeleted: false },
  });

  if (!tourPackage) {
    throw new AppError("Tour package not found", status.NOT_FOUND);
  }

  const completedBooking = await prisma.booking.findFirst({
    where: {
      userId,
      tourPackageId: input.tourPackageId,
      bookingStatus: "COMPLETED",
      isDeleted: false,
    },
  });

  if (!completedBooking) {
    throw new AppError(
      "You can only review a tour package after completing a booking",
      status.FORBIDDEN
    );
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_tourPackageId: {
        userId,
        tourPackageId: input.tourPackageId,
      },
    },
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this tour package", status.CONFLICT);
  }

  return prisma.review.create({
    data: {
      userId,
      tourPackageId: input.tourPackageId,
      rating: input.rating,
      comment: input.comment,
    },
    select: {
      ...reviewSelect,
      user: { select: userSelect },
    },
  });
};

export const getReviews = async (query: GetReviewsQuery) => {
  const tourPackage = await prisma.tourPackage.findFirst({
    where: { id: query.tourPackageId, isDeleted: false },
  });

  if (!tourPackage) {
    throw new AppError("Tour package not found", status.NOT_FOUND);
  }

  return prisma.review.findMany({
    where: { tourPackageId: query.tourPackageId },
    select: {
      ...reviewSelect,
      user: { select: userSelect },
    },
    orderBy: { createdAt: "desc" },
  });
};
