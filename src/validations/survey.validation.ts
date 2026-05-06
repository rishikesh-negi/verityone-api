import z from "zod";
import { surveyDurationInDaysOptions } from "../utils/constants.js";

export const surveyCreationSchema = z.object({
  body: z
    .object({
      surveyDurationInDays: z.union(surveyDurationInDaysOptions.map((option) => z.literal(option))),
      concludedAt: z.number(),
    })
    .refine(
      (data) =>
        data.concludedAt >= Date.now() - 60 * 60 * 1000 &&
        data.concludedAt <=
          Date.now() + Math.max(...surveyDurationInDaysOptions) * 24 * 60 * 60 * 1000 + 3600000,
      { error: "Invalid survey duration selected" },
    ),
});
