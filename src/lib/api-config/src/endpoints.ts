export const ENDPOINTS = {
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
  },
  TRANSCRIBE: {
    WHISPER: "transcribe-whisper",
  },
  ANALYSIS: {
    COMPLETE: "complete-analysis",
    FINAL_REPORT: "final-report",
    FETCH_REPORT: (interviewId: string) => `final-report/${interviewId}`,
  },
};
