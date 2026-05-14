import { Router, type RequestHandler } from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import { createSurvey } from "../controllers/surveyController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { surveyCreationSchema } from "../validations/survey.validation.js";

const router = Router();

router.use(protect);

router.post(
  "/create",
  restrictTo("Organization"),
  validateRequest(surveyCreationSchema) as RequestHandler,
  createSurvey,
);

export default router;
