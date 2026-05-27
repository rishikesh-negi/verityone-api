import { Router, type RequestHandler } from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import { createSurvey, endSurvey } from "../controllers/surveyController.js";
import { UnprocessableContentError } from "../errors/AppError.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  surveyCreationRequestSchema,
  surveyEndRequestSchema,
} from "../validations/survey.validation.js";

const router = Router();

router.use(protect);

router.post(
  "/create",
  restrictTo("Workplace"),
  validateRequest(surveyCreationRequestSchema) as RequestHandler,
  createSurvey,
);

router.patch(
  "/end/:surveyId",
  validateRequest(
    surveyEndRequestSchema,
    new UnprocessableContentError("Survey not found"),
  ) as RequestHandler,
  endSurvey,
);

export default router;
