import { Router, type RequestHandler } from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import { createInvite } from "../controllers/onboardingInviteController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { inviteSchema } from "../validations/onboardingInvite.validation.js";
import { BadRequestError } from "../errors/AppError.js";

const router = Router();

router.use(protect);

router.post(
  "/onboard/:employeeId",
  restrictTo("Organization") as RequestHandler,
  validateRequest(inviteSchema, new BadRequestError()) as RequestHandler,
  createInvite,
);

export default router;
