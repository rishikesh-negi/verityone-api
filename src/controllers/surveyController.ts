import { format } from "date-fns";
import mongoose from "mongoose";
import {
  AppError,
  BadRequestError,
  NotFoundError,
  OngoingSurveyExistsError,
  TooFewEmployesToSurveyError,
  UnauthorizedAccessError,
  UnprocessableContentError,
} from "../errors/AppError.js";
import type { EmployeeDocument } from "../models/employeeModel.js";
import { Survey } from "../models/surveyModel.js";
import { SurveyResponse } from "../models/surveyResponseModel.js";
import { SurveyResult } from "../models/surveyResultModel.js";
import { UserIdentityVault } from "../models/userIdentityVaultModel.js";
import type { WorkplaceDocument } from "../models/workplaceModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import {
  MIN_EMPLOYEES_TO_SURVEY,
  SURVEY_COOLDOWN_MS,
  SURVEY_DURATION_DAYS_OPTIONS,
} from "../utils/constants.js";
import { generateSuggestionsForCruxScores } from "../utils/generateRemarksAndSuggestions.js";
import { generateSurveyMetricScores } from "../utils/generateSurveyMetricScores.js";

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
        `Cannot create a new survey until ${format(surveyCooldown.concludedAt!.getTime() + SURVEY_COOLDOWN_MS, "MMM dd, yyyy")}`,
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
  const { surveyId } = req.params as { [K: string]: string };
  const workplaceId = (req.user as WorkplaceDocument).id;

  const survey = await Survey.findOne({
    _id: surveyId,
    workplace: workplaceId,
    hasConcluded: false,
  });
  if (!survey) return next(new NotFoundError("No such ongoing survey found"));

  const numEmployees = (req.user as WorkplaceDocument).numEmployees;
  const numParticipants = await SurveyResponse.countDocuments({
    survey: new mongoose.Types.ObjectId(surveyId),
  });
  const participation = numParticipants / numEmployees;
  if (participation < 0.6)
    return next(
      new UnprocessableContentError(
        "Cannot manually end a survey until participation rate reaches 60%",
      ),
    );

  const cruxAveragesAndRemarks = await SurveyResponse.aggregate([
    { $match: { survey: new mongoose.Types.ObjectId(surveyId) } },
    { $unwind: "$answers" },
    {
      $group: {
        _id: "$answers.crux",
        metric: { $first: "$answers.metric" },
        score: { $avg: "$answers.answer" },
      },
    },
    {
      $project: { _id: 0, crux: "$_id", metric: 1, score: 1 },
    },
    {
      $addFields: {
        remark: {
          $switch: {
            branches: [
              {
                case: { $and: [{ $gt: ["$score", 8] }, { $lte: ["$score", 10] }] },
                then: "excellent",
              },
              {
                case: { $and: [{ $gt: ["$score", 6] }, { $lte: ["$score", 8] }] },
                then: "good",
              },
              {
                case: { $and: [{ $gt: ["$score", 4] }, { $lte: ["$score", 6] }] },
                then: "satisfactory",
              },
              {
                case: { $and: [{ $gt: ["$score", 2] }, { $lte: ["$score", 4] }] },
                then: "poor",
              },
            ],
            default: "critical",
          },
        },
      },
    },
  ]);

  const cruxResults = generateSuggestionsForCruxScores(cruxAveragesAndRemarks);
  const metricScores = generateSurveyMetricScores(cruxAveragesAndRemarks);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    survey.hasConcluded = true;
    survey.numParticipants = numParticipants;
    survey.participationRate = participation;
    survey.concludedAt = new Date(Date.now());
    await survey.save({ session });
    await SurveyResult.create(
      [
        {
          survey: survey._id,
          participants: numParticipants,
          cruxResults,
          metricScores,
        },
      ],
      { session },
    );
    session.commitTransaction();
  } catch {
    await session.abortTransaction();
    next(new AppError("Something went wrong!", 500));
  } finally {
    session.endSession();
  }
});

export const submitSurveyResponse = catchAsyncError(async (req, res, next) => {
  const employeeId = (req.user as EmployeeDocument)._id;
  const { surveyId } = req.params as { [K: string]: string };
  if (!surveyId) return next(new UnprocessableContentError("Survey ID is missing or invalid"));

  const anonymousId = (
    await UserIdentityVault.findOne({ userId: employeeId }).select("anonymousId")
  )?.anonymousId;
  if (!anonymousId)
    return next(
      new UnprocessableContentError("Unable to verify your anonymity credentials internally"),
    );
  const { answers } = req.body;

  await SurveyResponse.create({
    survey: surveyId,
    anonymousId: anonymousId,
    answers,
  });

  res.status(201).json({
    status: "success",
    message: "Your response was recorded",
  });
});
