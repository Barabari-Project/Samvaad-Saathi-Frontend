export const ENDPOINTS = {
  HEALTH_CHECK: "",
  AUTH: {
    ABOUT_ME: "me",
    COGNITO_LOGIN: "auth/cognito/login",
    COGNITO_REFRESH: "auth/cognito/refresh",
    COGNITO_LOGOUT: "auth/cognito/logout",
  },
  USERS: {
    PROFILE: "users/profile",
  },
  RESUME: {
    EXTRACT: "extract-resume",
  },
  INTERVIEWS: {
    LIST: "interviews",
    CREATE: "interviews/create",
    GENERATE_QUESTIONS: "interviews/generate-questions",
    COMPLETE: "interviews/complete",
    QUESTIONS: (interviewId: string) => `interviews/${interviewId}/questions`,
    QUESTION_ATTEMPTS: (interviewId: string) =>
      `interviews/${interviewId}/question-attempts`,
    START_QUESTION_ATTEMPT: "interviews/question-attempts",
    WITH_SUMMARY: "interviews-with-summary",
    RESUME_INTERVIEW: `interviews/resume`,
  },
  TRANSCRIBE: {
    WHISPER: "transcribe-whisper",
  },
  ANALYSIS: {
    COMPLETE: "complete-analysis",
    FINAL_REPORT: "final-report",
    FETCH_REPORT: (interviewId: string) => `final-report/${interviewId}`,
    GENERATE_SUMMARY_REPORT: "summary-report",
    // GET_SUMMARY_REPORT: (interviewId: string) =>`summary-report/${interviewId}`,
  },
};

export const ENDPOINTS_V2 = {
  CREATE_INTERVIEW: "v2/interviews/create",
  GENERATE_QUESTIONS: "v2/interviews/generate-questions",
  SUPPLEMENTS: (interviewId: string) =>
    `v2/interviews/${interviewId}/supplements`,
  SUMMARY_REPORT: "v2/summary-report",
  GENERATE_STRUCTURED_ANSWERS: "v2/interviews/structure-practice",
  CREATE_PRONUNCIATION_PRACTICE: "v2/pronunciation/create",
  GET_PRONUNCIATION_PRACTICE_AUDIO: (
    practiceId: string,
    questionNumber: number
  ) => `v2/pronunciation/${practiceId}/audio/${questionNumber}`,
};
