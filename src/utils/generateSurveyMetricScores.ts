import { surveyMetrics, type CruxResult } from "../data/surveyQuestions.js";
import { generateSuggestionsForCruxScores } from "./generateRemarksAndSuggestions.js";

const kebabToCamelCase = (str: string) =>
  str
    .split("-")
    .map((word, i) => (i === 0 ? word : `${word[0]!.toUpperCase()}${word.slice(1)}`))
    .join("");

export const generateSurveyResult = (cruxAverages: CruxResult[]) => {
  const metricAverages = Object.fromEntries(
    surveyMetrics.map((metric) => [
      kebabToCamelCase(metric),
      Object.values(cruxAverages)
        .filter((cruxScore) => cruxScore.metric === metric)
        .reduce(
          (accum, curr, i, arr) => ({
            metric: curr.metric,
            score:
              i < arr.length - 1
                ? curr.score + accum.score
                : (curr.score + accum.score) / arr.length,
          }),
          {
            metric: "",
            score: 0,
          },
        ),
    ]),
  );
};
