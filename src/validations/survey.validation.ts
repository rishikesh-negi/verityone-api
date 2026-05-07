import z from "zod";
import { SURVEY_DURATION_DAYS_OPTIONS } from "../utils/constants.js";

export const surveyCreationSchema = z.object({
  body: z.object({
    surveyDurationInDays: z.union(SURVEY_DURATION_DAYS_OPTIONS.map((option) => z.literal(option))),
  }),
});
