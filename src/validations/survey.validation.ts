import z from "zod";
import { SURVEY_DURATION_DAYS_OPTIONS } from "../utils/constants.js";

export const surveyCreationRequestSchema = z.object({
  body: z.object({
    surveyDurationInDays: z.union(SURVEY_DURATION_DAYS_OPTIONS.map((option) => z.literal(option))),
  }),
});

export const surveyEndRequestSchema = z.object({ params: z.object({ surveyId: z.string() }) });

export const discardSurveyRequestSchema = z.object({ params: z.object({ surveyId: z.string() }) });
