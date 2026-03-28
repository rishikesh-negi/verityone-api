export const surveyQuestions = {
  socialHarmony: {
    unfairDiscrimination: {
      metric: "social-harmony",
      label: "unfair-discrimination",
      question:
        "Rate how often employees experience unfair discrimination from colleagues or superiors at work.",
    },
    workplaceIsolation: {
      metric: "social-harmony",
      label: "workplace-isolation",
      question: "Rate how often you feel isolated from team members or superiors at work.",
    },
    fairEqualTreatment: {
      metric: "social-harmony",
      label: "fair-equal-treatment",
      question:
        "Rate the fairness and equality in how employees—including your subordinates, colleagues, and superiors—are generally treated at work.",
    },
    officePoliticsPrevalence: {
      metric: "social-harmony",
      label: "office-politics-prevalence",
      question: "Rate how common or prevalent office politics is at work.",
    },
    officePoliticsNegativeImpact: {
      metric: "social-harmony",
      label: "office-politics-negative-impact",
      question:
        "Rate the extent to which office politics negatively impacts the workplace at <ORGANIZATION>.",
    },
  },

  leadershipCompetence: {
    managersGeneralEfficacy: {
      metric: "leadership-competence",
      label: "managers-general-efficacy",
      question: "Rate the general effectiveness and efficacy of your direct managers.",
    },
    managersTasksEfficacy: {
      metric: "leadership-competence",
      label: "managers-tasks-efficacy",
      question: "Rate how effective your managers are at ensuring tasks are completed by the team.",
    },
    mentorshipFrequency: {
      metric: "leadership-competence",
      label: "mentorship-frequency",
      question:
        "Rate how often you receive support, guidance, or mentorship from your superiors at work.",
    },
    mentorshipQuality: {
      metric: "leadership-competence",
      label: "mentorship-quality",
      question:
        "Rate the quality of support, guidance, or mentorship you receive from your superiors at work.",
    },
    taskClarityFrequency: {
      metric: "leadership-competence",
      label: "task-clarity-frequency",
      question: "Rate how often your leaders or managers provide clear tasks and expectations.",
    },
  },

  leadershipCommunicationEffectiveness: {
    leadershipCommunicationFrequency: {
      metric: "leadership-communication-effectiveness",
      label: "leadership-communication-frequency",
      question: "Rate how often you receive communication from leadership.",
    },
    leadershipCommunicationQuality: {
      metric: "leadership-communication-effectiveness",
      label: "leadership-communication-quality",
      question: "Rate the quality of communication you receive from leadership.",
    },
    feedbackFrequency: {
      metric: "leadership-communication-effectiveness",
      label: "feedback-frequency",
      question: "Rate how often you receive feedback from leadership.",
    },
    feedbackQuality: {
      metric: "leadership-communication-effectiveness",
      label: "feedback-quality",
      question: "Rate the quality of feedback you receive from leadership.",
    },
  },

  leadershipTransparencyAndFairness: {
    leadershipTransparency: {
      metric: "leadership-transparency-fairness",
      label: "leadership-transparency",
      question:
        "Rate the level of transparency and honesty demonstrated by your leaders or managers towards you and your team.",
    },
    leadershipAccountability: {
      metric: "leadership-transparency-fairness",
      label: "leadership-accountability",
      question:
        "Rate the extent of accountability and ownership demonstrated by upper management and leadership.",
    },
    fairEvaluation: {
      metric: "leadership-transparency-fairness",
      label: "fair-evaluation",
      question: "Rate how fair leadership is when evaluating employees' performance.",
    },
    employeeIncludedDecisionMaking: {
      metric: "leadership-transparency-fairness",
      label: "employee-included-decision-making",
      question:
        "Rate how much say employees have in leadership's decisions that directly or indirectly affect them.",
    },
    workloadDistribution: {
      metric: "leadership-transparency-fairness",
      label: "workload-distribution",
      question:
        "Rate how fairly and evenly workload is distributed within your team at <ORGANIZATION>.",
    },
  },

  perceivedTeamCompetence: {
    teamGeneralEfficacy: {
      metric: "perceived-team-competence",
      label: "team-general-efficacy",
      question: "Rate the general effectiveness and efficacy of your team members.",
    },
    teamTasksEfficacy: {
      metric: "perceived-team-competence",
      label: "team-tasks-efficacy",
      question: "Rate how effective your team members are at ensuring tasks are completed on time.",
    },
    teamCollaboration: {
      metric: "perceived-team-competence",
      label: "team-collaboration",
      question: "Rate how collaborative and supportive your team members are at work.",
    },
    teamMembersAccountability: {
      metric: "perceived-team-competence",
      label: "team-members-accountability",
      question:
        "Rate the extent of accountability and ownership demonstrated by your team members.",
    },
  },

  teamCommunicationEffectiveness: {
    teamCommunicationFrequency: {
      metric: "Team Communication Effectiveness",
      label: "team-communication-frequency",
      question: "Rate how often you receive communication from colleagues or team members?",
    },
    teamCommunicationQuality: {
      metric: "Team Communication Effectiveness",
      label: "team-communication-quality",
      question: "Rate the quality of communication you receive from colleagues or team members.",
    },
    teamResponsiveness: {
      metric: "Team Communication Effectiveness",
      label: "team-responsiveness",
      question: "Rate how responsive your team members are to your communication.",
    },
  },

  careerClarityAndDirection: {
    workSkillsAlignment: {
      metric: "Career Clarity & Direction",
      label: "work-skills-alignment",
      question:
        "Rate the extent to which your daily work aligns with your role and the core skill set you were hired for.",
    },
    careerGrowthPathClarity: {
      metric: "Career Clarity & Direction",
      label: "career-growth-path-clarity",
      question: "Rate how clear your career growth path is at <ORGANIZATION>.",
    },
    careerGoalsSupport: {
      metric: "Career Clarity & Direction",
      label: "career-goals-support",
      question: "Rate how well leadership supports your long-term career goals.",
    },
  },

  employeeAutonomy: {
    employeeMicromanagement: {
      metric: "Employee Autonomy",
      label: "employee-micromanagement",
      question: "Rate how often managers micromanage employees at work.",
    },
    employeeAutonomy: {
      metric: "Employee Autonomy",
      label: "employee-autonomy",
      question:
        "Rate how much autonomy and individual decision-making power you have at <ORGANIZATION>.",
    },
    leadershipTrustInEmployeeDecisions: {
      metric: "Employee Autonomy",
      label: "leadership-trust-in-employee-decisions",
      question: "Rate how much leadership trusts employees to make right decisions.",
    },
  },

  compensationSatisfaction: {
    salarySatisfaction: {
      metric: "Compensation Satisfaction",
      label: "salary-satisfaction",
      question: "Rate your level of satisfaction with your current salary.",
    },
    totalCompensationFairness: {
      metric: "Compensation Satisfaction",
      label: "total-compensation-fairness",
      question:
        "Rate the fairness of your total compensation (including salary, benefits, and other perks) compared to the industry standards for your role.",
    },
    perksBenefits: {
      metric: "Compensation Satisfaction",
      label: "perks-benefits",
      question: "Rate the perks and benefits available in your role at <ORGANIZATION>.",
    },
    careerGrowthSatisfaction: {
      metric: "Compensation Satisfaction",
      label: "career-growth-satisfaction",
      question:
        "Rate your level of satisfaction with the promotions and career progression you've experienced at <ORGANIZATION>.",
    },
  },

  upskillingOpportunities: {
    learningOpportunitiesFrequency: {
      metric: "Upskilling Opportunities",
      label: "learning-opportunities-frequency",
      question:
        "Rate how often learning and skill development opportunities are available in your role at <ORGANIZATION>.",
    },
    learningOpportunitiesQuality: {
      metric: "Upskilling Opportunities",
      label: "learning-opportunities-quality",
      question:
        "Rate how often learning and skill development opportunities are available in your role at <ORGANIZATION>.",
    },
    growthAfterUpskilling: {
      metric: "Upskilling Opportunities",
      label: "growth-after-upskilling",
      question:
        "Rate the extent to which <ORGANIZATION> supports career growth for employees who upskill.",
    },
  },

  workloadAndBurnout: {
    workloadManageability: {
      metric: "Workload and Burnout",
      label: "workload-manageability",
      question: "Rate how manageable your workload usually is.",
    },
    overwhelmingWorkloadFrequency: {
      metric: "Workload and Burnout",
      label: "overwhelming-workload-frequency",
      question: "Rate how often you feel overwhelmed by work.",
    },
    highStressOrBurnout: {
      metric: "Workload and Burnout",
      label: "high-stress-burnout",
      question:
        "Rate how often you experience high stress or symptoms of burnout at <ORGANIZATION>.",
    },
  },

  workLifeBalance: {
    workingHoursSatisfaction: {
      metric: "Work-Life Balance",
      label: "working-hours-satisfaction",
      question: "Rate your satisfaction with the working hours at <ORGANIZATION>.",
    },
    flexibilityLevel: {
      metric: "Work-Life Balance",
      label: "flexibility-level",
      question: "Rate the level of flexibility provided by <ORGANIZATION>.",
    },
    remoteHybridSupport: {
      metric: "Work-Life Balance",
      label: "remote-hybrid-support",
      question: "Rate how often remote or hybrid work is supported at <ORGANIZATION>.",
    },
    leavePolicySatisfaction: {
      metric: "Work-Life Balance",
      label: "leave-policy-satisfaction",
      question:
        "Rate your satisfaction with the flexibility and adequacy of <ORGANIZATION>'s leave policy.",
    },
    employeePersonalTime: {
      metric: "Work-Life Balance",
      label: "employee-personal-time",
      question: "Rate how well <ORGANIZATION> respects employees' personal time.",
    },
  },

  psychologicalSafety: {
    comfortInSharingOpinions: {
      metric: "Psychological Safety",
      label: "comfort-in-sharing-opinions",
      question: "Rate how well <ORGANIZATION> respects employees' personal time.",
    },
    contrarianOpinionsBacklashFrequency: {
      metric: "Psychological Safety",
      label: "contrarian-opinions-backlash-frequency",
      question:
        "Rate how often employees get backlash for sharing contrarian (unpopular) opinions or suggestions at work.",
    },
    safetyInRaisingConcerns: {
      metric: "Psychological Safety",
      label: "safety-in-raising-concern",
      question: "Rate how safe you feel raising concerns without fear of negative consequences.",
    },
  },

  recognitionAndAppreciation: {
    employeesAppreciationFrequency: {
      metric: "Recognition And Appreciation",
      label: "employees-appreciation-frequency",
      question: "Rate how often employees are appreciated by leadership for their work.",
    },
    employeeAppreciationPerception: {
      metric: "Recognition And Appreciation",
      label: "employee-appreciation-perception",
      question: "Rate how appreciated you feel for your work and contributions.",
    },
  },

  employeeSentiment: {
    voluntaryExtraEffort: {
      metric: "Employee Sentiment",
      label: "voluntary-extra-effort",
      question:
        "Rate your willingness to volunteer extra effort to complete your tasks effectively.",
    },
    prideInOrganization: {
      metric: "Employee Sentiment",
      label: "pride-in-organization",
      question:
        "Rate your willingness to volunteer extra effort to complete your tasks effectively.",
    },
    overallSatisfaction: {
      metric: "Employee Sentiment",
      label: "overall-satisfaction",
      question: "Rate your level of satisfaction with your current job.",
    },
  },

  employeeRetention: {
    approximateEmployeeTenure: {
      metric: "Employee Retention",
      label: "approximate-employee-tenure",
      question:
        "Approximately how many more years do you intend to remain employed at <ORGANIZATION>?",
    },
  },
};
