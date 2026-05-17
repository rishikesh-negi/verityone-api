import { Router, type RequestHandler } from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  acceptInvite,
  createInvite,
  getAllSentInvites,
  getEmployeeInvites,
  rejectInvite,
} from "../controllers/onboardingInviteController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  inviteReplySchema,
  inviteCreationRequestSchema,
} from "../validations/onboardingInvite.validation.js";
import { BadRequestError } from "../errors/AppError.js";

const router = Router();

router.use(protect);

router.get("/sent", restrictTo("Workplace"), getAllSentInvites);

router.post(
  "/send/:employeeId",
  restrictTo("Workplace"),
  validateRequest(inviteCreationRequestSchema, new BadRequestError()) as RequestHandler,
  createInvite,
);

router.get("/", restrictTo("Employee"), getEmployeeInvites);

router.patch(
  "/accept/:inviteId",
  restrictTo("Employee"),
  validateRequest(inviteReplySchema, new BadRequestError()) as RequestHandler,
  acceptInvite,
);

router.patch(
  "/reject/:inviteId",
  restrictTo("Employee"),
  validateRequest(inviteReplySchema, new BadRequestError()) as RequestHandler,
  rejectInvite,
);

export default router;
