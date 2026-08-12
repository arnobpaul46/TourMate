import { NextFunction, Request, Response } from "express";
import status from "http-status";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import AppError from "../errors/AppError";
import { sendResponse } from "../utils/sendResponse";

const isPrismaKnownRequestError = (
  error: unknown
): error is { code: string; meta?: Record<string, unknown> } =>
  typeof error === "object" &&
  error !== null &&
  "name" in error &&
  (error as { name: string }).name === "PrismaClientKnownRequestError" &&
  "code" in error;

const isPrismaValidationError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "name" in error &&
  (error as { name: string }).name === "PrismaClientValidationError";

export const globalErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ZodError) {
    return sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: "Validation error",
      data: error.flatten().fieldErrors,
    });
  }

  if (isPrismaKnownRequestError(error)) {
    if (error.code === "P1001") {
      return sendResponse(res, {
        statusCode: status.SERVICE_UNAVAILABLE,
        success: false,
        message: "Database is unreachable. Check DATABASE_URL and network.",
      });
    }

    if (error.code === "P2002") {
      return sendResponse(res, {
        statusCode: status.CONFLICT,
        success: false,
        message: "Duplicate field value",
        data: error.meta,
      });
    }

    if (error.code === "P2025") {
      return sendResponse(res, {
        statusCode: status.NOT_FOUND,
        success: false,
        message: "Record not found",
      });
    }
  }

  if (isPrismaValidationError(error)) {
    return sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: "Invalid data provided",
    });
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return sendResponse(res, {
      statusCode: status.UNAUTHORIZED,
      success: false,
      message: "Invalid token",
    });
  }

  if (error instanceof jwt.TokenExpiredError) {
    return sendResponse(res, {
      statusCode: status.UNAUTHORIZED,
      success: false,
      message: "Token expired",
    });
  }

  if (error instanceof AppError) {
    return sendResponse(res, {
      statusCode: error.statusCode,
      success: false,
      message: error.message,
    });
  }

  console.error(error);

  return sendResponse(res, {
    statusCode: status.INTERNAL_SERVER_ERROR,
    success: false,
    message:
      error instanceof Error ? error.message : "Internal server error",
  });
};
