import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GetTourPackagesQuery } from "./tourPackage.validation";
import * as tourPackageService from "./tourPackage.service";

export const createTourPackage = catchAsync(async (req: Request, res: Response) => {
  const tourPackage = await tourPackageService.createTourPackage(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Tour package created successfully",
    data: tourPackage,
  });
});

export const getTourPackages = catchAsync(async (req: Request, res: Response) => {
  const result = await tourPackageService.getTourPackages(
    req.query as unknown as GetTourPackagesQuery
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour packages retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const getTourPackageById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const tourPackage = await tourPackageService.getTourPackageById(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour package retrieved successfully",
    data: tourPackage,
  });
});

export const updateTourPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const tourPackage = await tourPackageService.updateTourPackage(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour package updated successfully",
    data: tourPackage,
  });
});

export const deleteTourPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const tourPackage = await tourPackageService.deleteTourPackage(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour package deleted successfully",
    data: tourPackage,
  });
});
