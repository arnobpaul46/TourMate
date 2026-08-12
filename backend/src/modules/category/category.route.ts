import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validate, validateParams } from "../../utils/validate";
import * as categoryController from "./category.controller";
import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation";

const router = Router();

router.get("/", categoryController.getCategories);
router.get(
  "/:id",
  validateParams(categoryIdSchema),
  categoryController.getCategoryById
);
router.post(
  "/",
  auth("ADMIN"),
  validate(createCategorySchema),
  categoryController.createCategory
);
router.patch(
  "/:id",
  auth("ADMIN"),
  validateParams(categoryIdSchema),
  validate(updateCategorySchema),
  categoryController.updateCategory
);
router.delete(
  "/:id",
  auth("ADMIN"),
  validateParams(categoryIdSchema),
  categoryController.deleteCategory
);

export default router;
