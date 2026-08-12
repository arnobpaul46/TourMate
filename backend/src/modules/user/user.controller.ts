import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import * as userService from "./user.service";

export const getUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await userService.getUsers();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", status.UNAUTHORIZED);
  }

  const user = await userService.getMe(req.user.id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: user,
  });
});

export const updateMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", status.UNAUTHORIZED);
  }

  const user = await userService.updateMe(req.user.id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});
