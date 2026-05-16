import { format } from "date-fns";
import {
  AppError,
  BadRequestError,
  NotFoundError,
  OngoingSurveyExistsError,
  TooFewEmployesToSurveyError,
  UnauthorizedAccessError,
  UnprocessableContentError,
} from "../errors/AppError.js";
import type { WorkplaceDocument } from "../models/workplaceModel.js";
import { Survey } from "../models/surveyModel.js";
import { SurveyResponse } from "../models/surveyResponseModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import {
  MIN_EMPLOYEES_TO_SURVEY,
  SURVEY_COOLDOWN_MS,
  SURVEY_DURATION_DAYS_OPTIONS,
} from "../utils/constants.js";

export const createSurvey = catchAsyncError(async (req, res, next) => {
  const workplace = req.user?.id;
  if (!workplace) return next(new UnauthorizedAccessError());

  const numEmployees = (req.user as WorkplaceDocument).numEmployees;
  if (numEmployees < MIN_EMPLOYEES_TO_SURVEY) return next(new TooFewEmployesToSurveyError());

  const ongoingSurvey = await Survey.exists({ workplace, hasConcluded: false });
  if (ongoingSurvey) return next(new OngoingSurveyExistsError());

  const surveyCooldown = await Survey.findOne({
    workplace,
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
  const newSurvey = await Survey.create({ workplace, surveyDurationInDays, concludedAt });

  return res.status(201).json({
    status: "success",
    message: "Survey successfully created!",
    survey: newSurvey,
  });
});

export const endSurvey = catchAsyncError(async (req, res, next) => {
  const surveyId = req.params;
  const orgId = (req.user as WorkplaceDocument).id;

  const survey = await Survey.findOne({ _id: surveyId, workplace: orgId, hasConcluded: false });
  if (!survey) return next(new NotFoundError("No such survey found"));

  const numEmployees = (req.user as WorkplaceDocument).numEmployees;
  const numParticipants = await SurveyResponse.countDocuments({ survey: surveyId });
  const participation = numParticipants / numEmployees;
  if (participation < 0.6)
    return next(
      new UnprocessableContentError(
        "Cannot manually end a survey with participation rate less than 60%",
      ),
    );

  // 1. Add survey result & analytics generation logic here
  // 2. Update survey status and conclusion date & time
});
