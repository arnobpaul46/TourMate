import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validate, validateQuery } from "../../utils/validate";
import * as reviewController from "./review.controller";
import { createReviewSchema, getReviewsQuerySchema } from "./review.validation";

const router = Router();

router.get(
  "/",
  validateQuery(getReviewsQuerySchema),
  reviewController.getReviews
);
router.post(
  "/",
  auth("USER"),
  validate(createReviewSchema),
  reviewController.createReview
);

export default router;
