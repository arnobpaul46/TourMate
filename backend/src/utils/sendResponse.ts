import { Response } from "express";

interface SendResponseOptions {
  statusCode: number;
  success: boolean;
  message: string;
  data?: unknown;
  meta?: Record<string, unknown>;
}

export const sendResponse = (
  res: Response,
  { statusCode, success, message, data, meta }: SendResponseOptions
) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  });
};
