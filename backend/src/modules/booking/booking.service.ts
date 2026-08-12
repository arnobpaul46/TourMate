import status from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../lib/prisma";
import { TokenPayload } from "../../utils/jwt";
import {
  CreateBookingInput,
  UpdateBookingStatusInput,
} from "./booking.validation";

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
};

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
};

const bookingSelect = {
  id: true,
  tourPackageId: true,
  userId: true,
  travelDate: true,
  guests: true,
  totalPrice: true,
  bookingStatus: true,
  paymentStatus: true,
  createdAt: true,
  updatedAt: true,
};

const bookingInclude = {
  tourPackage: { select: tourPackageSelect },
  user: { select: userSelect },
};

export const createBooking = async (
  userId: string,
  input: CreateBookingInput
) => {
  const tourPackage = await prisma.tourPackage.findFirst({
    where: { id: input.tourPackageId, isDeleted: false },
  });

  if (!tourPackage) {
    throw new AppError("Tour package not found", status.NOT_FOUND);
  }

  if (input.guests > tourPackage.maxGroupSize) {
    throw new AppError(
      `Guests cannot exceed max group size of ${tourPackage.maxGroupSize}`,
      status.BAD_REQUEST
    );
  }

  const totalPrice = tourPackage.price * input.guests;

  return prisma.booking.create({
    data: {
      tourPackageId: input.tourPackageId,
      userId,
      travelDate: input.travelDate,
      guests: input.guests,
      totalPrice,
    },
    select: {
      ...bookingSelect,
      tourPackage: { select: tourPackageSelect },
      user: { select: userSelect },
    },
  });
};

export const getBookings = async (currentUser: TokenPayload) => {
  const where =
    currentUser.role === "ADMIN"
      ? { isDeleted: false }
      : { userId: currentUser.id, isDeleted: false };

  return prisma.booking.findMany({
    where,
    select: {
      ...bookingSelect,
      ...bookingInclude,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateBookingStatus = async (
  id: string,
  input: UpdateBookingStatusInput
) => {
  const booking = await prisma.booking.findFirst({
    where: { id, isDeleted: false },
  });

  if (!booking) {
    throw new AppError("Booking not found", status.NOT_FOUND);
  }

  return prisma.booking.update({
    where: { id },
    data: {
      ...(input.bookingStatus && { bookingStatus: input.bookingStatus }),
      ...(input.paymentStatus && { paymentStatus: input.paymentStatus }),
    },
    select: {
      ...bookingSelect,
      ...bookingInclude,
    },
  });
};

export const deleteBooking = async (id: string, currentUser: TokenPayload) => {
  const booking = await prisma.booking.findFirst({
    where: { id, isDeleted: false },
  });

  if (!booking) {
    throw new AppError("Booking not found", status.NOT_FOUND);
  }

  if (currentUser.role !== "ADMIN" && booking.userId !== currentUser.id) {
    throw new AppError(
      "You are not authorized to delete this booking",
      status.FORBIDDEN
    );
  }

  return prisma.booking.update({
    where: { id },
    data: { isDeleted: true },
    select: {
      ...bookingSelect,
      ...bookingInclude,
    },
  });
};
