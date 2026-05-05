export type SurveyQuestion = {
  metric: string;
  crux: string;
  question: string;
};

export const surveyQuestions: SurveyQuestion[] = [
  {
    metric: "social-harmony",
    crux: "unfair-discrimination",
    question:
      "Rate how often employees experience unfair discrimination from colleagues or superiors at work.",
  },
  {
    metric: "social-harmony",
    crux: "workplace-isolation",
    question: "Rate how often you feel isolated from team members or superiors at work.",
  },
  {
    metric: "social-harmony",
    crux: "fair-equal-treatment",
    question:
      "Rate the fairness and equality in how employees—including your subordinates, colleagues, and superiors—are generally treated at work.",
  },
  {
    metric: "social-harmony",
    crux: "office-politics-prevalence",
    question: "Rate how common or prevalent office politics is at work.",
  },
  {
    metric: "social-harmony",
    crux: "office-politics-negative-impact",
    question:
      "Rate the extent to which office politics negatively impacts the workplace at <ORGANIZATION>.",
  },

  {
    metric: "leadership-competence",
    crux: "managers-general-efficacy",
    question: "Rate the general effectiveness and efficacy of your direct managers.",
  },
  {
    metric: "leadership-competence",
    crux: "managers-tasks-efficacy",
    question: "Rate how effective your managers are at ensuring tasks are completed by the team.",
  },
  {
    metric: "leadership-competence",
    crux: "mentorship-frequency",
    question:
      "Rate how often you receive support, guidance, or mentorship from your superiors at work.",
  },
  {
    metric: "leadership-competence",
    crux: "mentorship-quality",
    question:
      "Rate the quality of support, guidance, or mentorship you receive from your superiors at work.",
  },
  {
    metric: "leadership-competence",
    crux: "task-clarity-frequency",
    question: "Rate how often your leaders or managers provide clear tasks and expectations.",
  },

  {
    metric: "leadership-communication-effectiveness",
    crux: "leadership-communication-frequency",
    question: "Rate how often you receive communication from leadership.",
  },
  {
    metric: "leadership-communication-effectiveness",
    crux: "leadership-communication-quality",
    question: "Rate the quality of communication you receive from leadership.",
  },
  {
    metric: "leadership-communication-effectiveness",
    crux: "feedback-frequency",
    question: "Rate how often you receive feedback from leadership.",
  },
  {
    metric: "leadership-communication-effectiveness",
    crux: "feedback-quality",
    question: "Rate the quality of feedback you receive from leadership.",
  },

  {
    metric: "leadership-transparency-fairness",
    crux: "leadership-transparency",
    question:
      "Rate the level of transparency and honesty demonstrated by your leaders or managers towards you and your team.",
  },
  {
    metric: "leadership-transparency-fairness",
    crux: "leadership-accountability",
    question:
      "Rate the extent of accountability and ownership demonstrated by upper management and leadership.",
  },
  {
    metric: "leadership-transparency-fairness",
    crux: "fair-evaluation",
    question: "Rate how fair leadership is when evaluating employees' performance.",
  },
  {
    metric: "leadership-transparency-fairness",
    crux: "employee-included-decision-making",
    question:
      "Rate how much say employees have in leadership's decisions that directly or indirectly affect them.",
  },
  {
    metric: "leadership-transparency-fairness",
    crux: "workload-distribution",
    question:
      "Rate how fairly and evenly workload is distributed within your team at <ORGANIZATION>.",
  },

  {
    metric: "perceived-team-competence",
    crux: "team-general-efficacy",
    question: "Rate the general effectiveness and efficacy of your team members.",
  },
  {
    metric: "perceived-team-competence",
    crux: "team-tasks-efficacy",
    question: "Rate how effective your team members are at ensuring tasks are completed on time.",
  },
  {
    metric: "perceived-team-competence",
    crux: "team-collaboration",
    question: "Rate how collaborative and supportive your team members are at work.",
  },
  {
    metric: "perceived-team-competence",
    crux: "team-members-accountability",
    question: "Rate the extent of accountability and ownership demonstrated by your team members.",
  },

  {
    metric: "team-communication-effectiveness",
    crux: "team-communication-frequency",
    question: "Rate how often you receive communication from colleagues or team members?",
  },
  {
    metric: "team-communication-effectiveness",
    crux: "team-communication-quality",
    question: "Rate the quality of communication you receive from colleagues or team members.",
  },
  {
    metric: "team-communication-effectiveness",
    crux: "team-responsiveness",
    question: "Rate how responsive your team members are to your communication.",
  },

  {
    metric: "career-clarity-direction",
    crux: "work-skills-alignment",
    question:
      "Rate the extent to which your daily work aligns with your role and the core skill set you were hired for.",
  },
  {
    metric: "career-clarity-direction",
    crux: "career-growth-path-clarity",
    question: "Rate how clear your career growth path is at <ORGANIZATION>.",
  },
  {
    metric: "career-clarity-direction",
    crux: "career-goals-support",
    question: "Rate how well leadership supports your long-term career goals.",
  },

  {
    metric: "employee-autonomy",
    crux: "employee-micromanagement",
    question: "Rate how often managers micromanage employees at work.",
  },
  {
    metric: "employee-autonomy",
    crux: "employee-autonomy",
    question:
      "Rate how much autonomy and individual decision-making power you have at <ORGANIZATION>.",
  },
  {
    metric: "employee-autonomy",
    crux: "leadership-trust-in-employee-decisions",
    question: "Rate how much leadership trusts employees to make right decisions.",
  },

  {
    metric: "compensation-satisfaction",
    crux: "salary-satisfaction",
    question: "Rate your level of satisfaction with your current salary.",
  },
  {
    metric: "compensation-satisfaction",
    crux: "total-compensation-fairness",
    question:
      "Rate the fairness of your total compensation (including salary, benefits, and other perks) compared to the industry standards for your role.",
  },
  {
    metric: "compensation-satisfaction",
    crux: "perks-benefits",
    question: "Rate the perks and benefits available in your role at <ORGANIZATION>.",
  },
  {
    metric: "compensation-satisfaction",
    crux: "career-growth-satisfaction",
    question:
      "Rate your level of satisfaction with the promotions and career progression you've experienced at <ORGANIZATION>.",
  },

  {
    metric: "upskilling-opportunities",
    crux: "learning-opportunities-frequency",
    question:
      "Rate how often learning and skill development opportunities are available in your role at <ORGANIZATION>.",
  },
  {
    metric: "upskilling-opportunities",
    crux: "learning-opportunities-quality",
    question:
      "Rate how often learning and skill development opportunities are available in your role at <ORGANIZATION>.",
  },
  {
    metric: "upskilling-opportunities",
    crux: "growth-after-upskilling",
    question:
      "Rate the extent to which <ORGANIZATION> supports career growth for employees who upskill.",
  },

  {
    metric: "workload-and-burnout",
    crux: "workload-manageability",
    question: "Rate how manageable your workload usually is.",
  },
  {
    metric: "workload-and-burnout",
    crux: "overwhelming-workload-frequency",
    question: "Rate how often you feel overwhelmed by work.",
  },
  {
    metric: "workload-and-burnout",
    crux: "high-stress-burnout",
    question: "Rate how often you experience high stress or symptoms of burnout at <ORGANIZATION>.",
  },

  {
    metric: "work-life-balance",
    crux: "working-hours-satisfaction",
    question: "Rate your satisfaction with the working hours at <ORGANIZATION>.",
  },
  {
    metric: "work-life-balance",
    crux: "flexibility-level",
    question: "Rate the level of flexibility provided by <ORGANIZATION>.",
  },
  {
    metric: "work-life-balance",
    crux: "remote-hybrid-support",
    question: "Rate how often remote or hybrid work is supported at <ORGANIZATION>.",
  },
  {
    metric: "work-life-balance",
    crux: "leave-policy-satisfaction",
    question:
      "Rate your satisfaction with the flexibility and adequacy of <ORGANIZATION>'s leave policy.",
  },
  {
    metric: "work-life-balance",
    crux: "employee-personal-time",
    question: "Rate how well <ORGANIZATION> respects employees' personal time.",
  },

  {
    metric: "psychological-safety",
    crux: "comfort-in-sharing-opinions",
    question: "Rate how well <ORGANIZATION> respects employees' personal time.",
  },
  {
    metric: "psychological-safety",
    crux: "contrarian-opinions-backlash-frequency",
    question:
      "Rate how often employees get backlash for sharing contrarian (unpopular) opinions or suggestions at work.",
  },
  {
    metric: "psychological-safety",
    crux: "safety-in-raising-concern",
    question: "Rate how safe you feel raising concerns without fear of negative consequences.",
  },

  {
    metric: "recognition-and-appreciation",
    crux: "employees-appreciation-frequency",
    question: "Rate how often employees are appreciated by leadership for their work.",
  },
  {
    metric: "recognition-and-appreciation",
    crux: "employee-appreciation-perception",
    question: "Rate how appreciated you feel for your work and contributions.",
  },

  {
    metric: "employee-sentiment",
    crux: "voluntary-extra-effort",
    question: "Rate your willingness to volunteer extra effort to complete your tasks effectively.",
  },
  {
    metric: "employee-sentiment",
    crux: "pride-in-organization",
    question: "Rate your willingness to volunteer extra effort to complete your tasks effectively.",
  },
  {
    metric: "employee-sentiment",
    crux: "overall-satisfaction",
    question: "Rate your level of satisfaction with your current job.",
  },

  {
    metric: "employee-retention",
    crux: "approximate-employee-tenure",
    question:
      "Approximately how many more years do you intend to remain employed at <ORGANIZATION>?",
  },
];

export const surveyMetrics = [...new Set(surveyQuestions.map((q) => q.metric))];
export const surveyCruxes = surveyQuestions.map((q) => q.crux);
export const numQuestions = surveyQuestions.length;
