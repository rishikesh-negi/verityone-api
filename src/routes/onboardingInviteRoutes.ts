import { Router, type RequestHandler } from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import { createInvite } from "../controllers/onboardingInviteController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { inviteSchema } from "../validations/onboardingInvite.validation.js";

const router = Router();

router.use(protect);

router.post(
  "/send-invite",
  restrictTo("Organization") as RequestHandler,
  validateRequest(inviteSchema) as RequestHandler,
  createInvite,
);

export default router;
