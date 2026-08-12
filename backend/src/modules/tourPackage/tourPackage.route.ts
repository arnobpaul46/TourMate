import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validate, validateParams, validateQuery } from "../../utils/validate";
import * as tourPackageController from "./tourPackage.controller";
import {
  createTourPackageSchema,
  getTourPackagesQuerySchema,
  tourPackageIdSchema,
  updateTourPackageSchema,
} from "./tourPackage.validation";

const router = Router();

router.get(
  "/",
  validateQuery(getTourPackagesQuerySchema),
  tourPackageController.getTourPackages
);
router.get(
  "/:id",
  validateParams(tourPackageIdSchema),
  tourPackageController.getTourPackageById
);
router.post(
  "/",
  auth("ADMIN"),
  validate(createTourPackageSchema),
  tourPackageController.createTourPackage
);
router.patch(
  "/:id",
  auth("ADMIN"),
  validateParams(tourPackageIdSchema),
  validate(updateTourPackageSchema),
  tourPackageController.updateTourPackage
);
router.delete(
  "/:id",
  auth("ADMIN"),
  validateParams(tourPackageIdSchema),
  tourPackageController.deleteTourPackage
);

export default router;
