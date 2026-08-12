import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import bookingRoutes from "../modules/booking/booking.route";
import categoryRoutes from "../modules/category/category.route";
import reviewRoutes from "../modules/review/review.route";
import tourPackageRoutes from "../modules/tourPackage/tourPackage.route";
import userRoutes from "../modules/user/user.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/tour-packages", tourPackageRoutes);
router.use("/bookings", bookingRoutes);
router.use("/reviews", reviewRoutes);
router.use("/users", userRoutes);

export default router;
