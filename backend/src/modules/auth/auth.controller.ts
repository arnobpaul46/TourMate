import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import * as authService from "./auth.service";

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});
