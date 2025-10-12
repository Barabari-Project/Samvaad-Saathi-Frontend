// API Response Types
export interface ReportResponse {
  reportId: string;
  candidateInfo: {
    name: string;
    interviewDate: string;
    roleTopic: string;
  };
  scoreSummary: {
    knowledgeCompetence: {
      score: number;
      maxScore: number;
      average: number;
      maxAverage: number;
      percentage: number;
      criteria: {
        accuracy: number;
        depth: number;
        relevance: number;
        examples: number;
        terminology: number;
      };
    };
    speechAndStructure: {
      score: number;
      maxScore: number;
      average: number;
      maxAverage: number;
      percentage: number;
      criteria: {
        fluency: number;
        structure: number;
        pacing: number;
        grammar: number;
      };
    };
  };
  overallFeedback: {
    speechFluency: {
      strengths: string[];
      areasOfImprovement: string[];
      actionableSteps: Array<{
        title: string;
        description: string;
      }>;
    };
  };
  questionAnalysis: Array<{
    id: number;
    totalQuestions: number;
    type: string;
    question: string;
    feedback: {
      knowledgeRelated: {
        strengths: string[];
        areasOfImprovement: string[];
        actionableInsights: Array<{
          title: string;
          description: string;
        }>;
      };
    } | null;
  }>;
}

// Component Props Types
export type SummaryOverviewProps = {
  candidateName: string;
  role: string;
  date: string;
};

export type OverallScoreSummaryProps = {
  knowledgeCompetence: ReportResponse["scoreSummary"]["knowledgeCompetence"];
  speechAndStructure: ReportResponse["scoreSummary"]["speechAndStructure"];
};

export type FinalSummaryProps = {
  speechFluency: ReportResponse["overallFeedback"]["speechFluency"];
};

export type PerQuestionAnalysisProps = {
  questionAnalysis: ReportResponse["questionAnalysis"];
};
