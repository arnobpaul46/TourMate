import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validate } from "../../utils/validate";
import * as userController from "./user.controller";
import { updateMeSchema } from "./user.validation";

const router = Router();

router.get("/me", auth("ADMIN", "USER"), userController.getMe);
router.patch(
  "/me",
  auth("ADMIN", "USER"),
  validate(updateMeSchema),
  userController.updateMe
);
router.get("/", auth("ADMIN"), userController.getUsers);

export default router;
