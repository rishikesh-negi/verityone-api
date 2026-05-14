import { format } from "date-fns";
import {
  AppError,
  BadRequestError,
  OngoingSurveyExistsError,
  TooFewEmployesToSurveyError,
  UnauthorizedAccessError,
} from "../errors/AppError.js";
import { Survey } from "../models/surveyModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { Employee } from "../models/employeeModel.js";
import {
  MIN_EMPLOYEES_TO_SURVEY,
  SURVEY_COOLDOWN_MS,
  SURVEY_DURATION_DAYS_OPTIONS,
} from "../utils/constants.js";

export const createSurvey = catchAsyncError(async (req, res, next) => {
  const organization = req.user?.id;
  if (!organization) return next(new UnauthorizedAccessError());

  const numEmployees = await Employee.countDocuments({ active: true, organization });
  if (numEmployees < MIN_EMPLOYEES_TO_SURVEY) return next(new TooFewEmployesToSurveyError());

  const ongoingSurvey = await Survey.exists({ organization, hasConcluded: false });
  if (ongoingSurvey) return next(new OngoingSurveyExistsError());

  const surveyCooldown = await Survey.findOne({
    organization,
    concludedAt: { $gte: Date.now() - SURVEY_COOLDOWN_MS },
  }).select("concludedAt");
  if (surveyCooldown)
    return next(
      new AppError(
        `Cannot create a new survey until ${format(surveyCooldown.concludedAt.getTime() + SURVEY_COOLDOWN_MS, "MMM dd, yyyy")}`,
      ),
    );

  const { surveyDurationInDays } = req.body;
  if (!surveyDurationInDays || !SURVEY_DURATION_DAYS_OPTIONS.includes(surveyDurationInDays))
    return next(new BadRequestError("Invalid value received for survey duration"));

  const concludedAt = Date.now() + surveyDurationInDays * 24 * 60 * 60 * 1000;
  const newSurvey = await Survey.create({ organization, surveyDurationInDays, concludedAt });

  return res.status(201).json({
    status: "success",
    message: "Survey successfully created!",
    survey: newSurvey,
  });
});
