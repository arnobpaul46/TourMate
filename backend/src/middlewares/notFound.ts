import { NextFunction, Request, Response } from "express";
import status from "http-status";
import AppError from "../errors/AppError";

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Route not found", status.NOT_FOUND));
};
