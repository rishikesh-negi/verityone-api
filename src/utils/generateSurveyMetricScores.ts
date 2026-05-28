import { surveyMetrics, type CruxScoreAndRemark } from "../data/surveyQuestions.js";

export const generateSurveyMetricScores = (cruxAverages: CruxScoreAndRemark[]) => {
  const metricAverages = surveyMetrics.map((metric) =>
    cruxAverages
      .filter((crux) => crux.metric === metric)
      .reduce(
        (accum, curr, i, arr) => ({
          metric: curr.metric,
          score:
            i < arr.length - 1 ? curr.score + accum.score : (curr.score + accum.score) / arr.length,
        }),
        {
          metric: "",
          score: 0,
        },
      ),
  );

  return metricAverages;
};
