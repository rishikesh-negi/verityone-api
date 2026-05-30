import { Router, type RequestHandler } from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  createSurvey,
  discardSurvey,
  endSurvey,
  submitSurveyResponse,
} from "../controllers/surveyController.js";
import { UnprocessableContentError } from "../errors/AppError.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  discardSurveyRequestSchema,
  surveyCreationRequestSchema,
  surveyEndRequestSchema,
} from "../validations/survey.validation.js";
import { surveyResponseZSchema } from "../validations/surveyResponse.validation.js";

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
  restrictTo("Workplace"),
  validateRequest(
    surveyEndRequestSchema,
    new UnprocessableContentError("Survey not found"),
  ) as RequestHandler,
  endSurvey,
);

router.post(
  "/respond/:surveyId",
  restrictTo("Employee"),
  validateRequest(
    surveyResponseZSchema,
    new UnprocessableContentError("Incomplete or invalid survey response received"),
  ) as RequestHandler,
  submitSurveyResponse,
);

router.delete(
  "/discard/:surveyId",
  restrictTo("Workplace"),
  validateRequest(discardSurveyRequestSchema) as RequestHandler,
  discardSurvey,
);

export default router;
