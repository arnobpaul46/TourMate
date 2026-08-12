import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GetReviewsQuery } from "./review.validation";
import * as reviewService from "./review.service";

export const createReview = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", status.UNAUTHORIZED);
  }

  const review = await reviewService.createReview(req.user.id, req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Review created successfully",
    data: review,
  });
});

export const getReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews = await reviewService.getReviews(
    req.query as unknown as GetReviewsQuery
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: reviews,
  });
});
