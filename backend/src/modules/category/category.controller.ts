import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import * as categoryService from "./category.service";

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

export const getCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

export const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const category = await categoryService.getCategoryById(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category retrieved successfully",
    data: category,
  });
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const category = await categoryService.updateCategory(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const category = await categoryService.deleteCategory(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category deleted successfully",
    data: category,
  });
});
