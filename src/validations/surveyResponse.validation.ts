import z from "zod";
import { metrics, numQuestions, questionCruxes } from "../data/surveyQuestions.js";

const answerSchema = z.object({
  metric: z.enum(metrics),
  crux: z.enum(questionCruxes),
  response: z
    .number()
    .min(1, "Response score should be at least 1")
    .max(10, "Response score cannot exceed 10"),
});

export const responseSchema = z.object({
  body: z.object({
    responses: z.array(answerSchema).refine((answers) => {
      const answerCruxes = new Set(answers.map((answer) => answer.crux));
      return (
        answers.length === numQuestions &&
        answerCruxes.size === numQuestions &&
        questionCruxes.every((crux) => answerCruxes.has(crux))
      );
    }),
  }),
});
export type SurveyResponseData = z.infer<typeof responseSchema>;
