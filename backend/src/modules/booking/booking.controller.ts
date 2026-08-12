import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import * as bookingService from "./booking.service";

export const createBooking = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", status.UNAUTHORIZED);
  }

  const booking = await bookingService.createBooking(req.user.id, req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

export const getBookings = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", status.UNAUTHORIZED);
  }

  const bookings = await bookingService.getBookings(req.user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: bookings,
  });
});

export const updateBookingStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const booking = await bookingService.updateBookingStatus(id, req.body);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Booking status updated successfully",
      data: booking,
    });
  }
);

export const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", status.UNAUTHORIZED);
  }

  const { id } = req.params as { id: string };
  const booking = await bookingService.deleteBooking(id, req.user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Booking deleted successfully",
    data: booking,
  });
});
