import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validate, validateParams } from "../../utils/validate";
import * as bookingController from "./booking.controller";
import {
  bookingIdSchema,
  createBookingSchema,
  updateBookingStatusSchema,
} from "./booking.validation";

const router = Router();

router.post(
  "/",
  auth("USER"),
  validate(createBookingSchema),
  bookingController.createBooking
);
router.get("/", auth("ADMIN", "USER"), bookingController.getBookings);
router.patch(
  "/:id/status",
  auth("ADMIN"),
  validateParams(bookingIdSchema),
  validate(updateBookingStatusSchema),
  bookingController.updateBookingStatus
);
router.delete(
  "/:id",
  auth("ADMIN", "USER"),
  validateParams(bookingIdSchema),
  bookingController.deleteBooking
);

export default router;
