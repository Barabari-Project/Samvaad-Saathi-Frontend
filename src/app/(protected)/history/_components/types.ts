export interface InterviewItem {
  interviewId: number;
  track: string;
  difficulty: string;
  status: string;
  createdAt: string;
  knowledgePercentage?: number;
  speechFluencyPercentage?: number;
  resumeUsed: boolean;
  attemptsCount: number;
}

export interface InterviewsListResponse {
  items: InterviewItem[];
  nextCursor: number | null;
  limit: number;
}

export interface ResumeInterviewQuestion {
  interviewQuestionId: number;
  text: string;
  topic: string;
  category: string;
  status: string;
  resumeUsed: boolean;
}

export interface ResumeInterviewResponse {
  interviewId: number;
  track: string;
  difficulty: string;
  questions: ResumeInterviewQuestion[];
  totalQuestions: number;
  attemptedQuestions: number;
  remainingQuestions: number;
}

export type InterviewStatus = "incomplete" | "completed";
