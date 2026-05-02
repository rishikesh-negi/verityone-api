import { Router, type RequestHandler } from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  acceptInvite,
  createInvite,
  rejectInvite,
} from "../controllers/onboardingInviteController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { inviteActionSchema, inviteSchema } from "../validations/onboardingInvite.validation.js";
import { BadRequestError } from "../errors/AppError.js";

const router = Router();

router.use(protect);

router.post(
  "/onboard/:employeeId",
  restrictTo("Organization"),
  validateRequest(inviteSchema, new BadRequestError()) as RequestHandler,
  createInvite,
);

router.patch(
  "/accept/:inviteId",
  restrictTo("Employee"),
  validateRequest(inviteActionSchema, new BadRequestError()) as RequestHandler,
  acceptInvite,
);

router.patch(
  "/reject/:inviteId",
  restrictTo("Employee"),
  validateRequest(inviteActionSchema, new BadRequestError()) as RequestHandler,
  rejectInvite,
);

export default router;
