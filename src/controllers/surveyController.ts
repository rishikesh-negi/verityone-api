import { format } from "date-fns";
import { AppError, OngoingSurveyExistsError, UnauthorizedAccessError } from "../errors/AppError.js";
import { Survey } from "../models/surveyModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";

export const createSurvey = catchAsyncError(async (req, res, next) => {
  const organization = req.user?.id;
  if (!organization) return next(new UnauthorizedAccessError());

  const ongoingSurvey = await Survey.exists({ hasConcluded: false });
  if (ongoingSurvey) return next(new OngoingSurveyExistsError());

  const lastSurvey = await Survey.findOne({ organization }).sort({ concludedAt: -1 }).exec();
  if (lastSurvey && lastSurvey.concludedAt.getTime() > Date.now() - 180 * 24 * 60 * 60 * 1000)
    return next(
      new AppError(
        `Cannot create a new survey until ${format(lastSurvey.concludedAt.getTime() + 180 * 24 * 60 * 60 * 1000, "MMM dd, yyyy")}`,
      ),
    );
});
