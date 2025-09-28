"use client";
import { useAuth } from "@/components/providers/auth-provider";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import { useSearchParams } from "next/navigation";
import React from "react";
import ActionableSteps from "./_components/ActionableSteps";
import FinalSummary from "./_components/FinalSummary";
import OverallScoreSummary from "./_components/OverallScoreSummary";
import SkeletonLoader from "./_components/SkeletonLoader";
import SummaryOverview from "./_components/SummaryOverview";
import TopicHighlights from "./_components/TopicHighlights";

// API Response Types
interface ReportResponse {
  interviewId: number;
  overallScoreSummary: {
    knowledgeCompetence: {
      average5pt: number;
      averagePct: number;
      breakdown: {
        accuracy: number;
        depth: number;
        coverage: number;
        relevance: number;
      };
    };
    speechStructure: {
      average5pt: number;
      averagePct: number;
      breakdown: {
        pacing: number;
        structure: number;
        pauses: number;
        grammar: number;
      };
    };
  };
  finalSummary: {
    strengths: {
      knowledgeRelated: string[];
      speechFluencyRelated: string[];
    };
    areasOfImprovement: {
      knowledgeRelated: string[];
      speechFluencyRelated: string[];
    };
  };
  actionableSteps: {
    knowledgeDevelopment: {
      targetedConceptReinforcement: string[];
      examplePractice: string[];
      conceptualDepth: string[];
    };
    speechStructureFluency: {
      fluencyDrills: string[];
      grammarPractice: string[];
      structureFramework: string[];
    };
  };
  metadata: {
    totalQuestions: number;
    usedQuestions: number;
    model: string;
    latencyMs: number;
    generatedAt: string | null;
  };
  perQuestion: Array<{
    questionAttemptId: number;
    questionText: string;
    keyTakeaways: string[];
    knowledgeScorePct: number;
    speechScorePct: number;
  }>;
  topicHighlights: {
    strengthsTopics: string[];
    improvementTopics: string[];
  };
  track: string;
}

const ReportSummaryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const { user } = useAuth();

  const apiClient = createApiClient(APIService.ANALYSIS);

  const {
    data: reportData,
    isLoading,
    error,
  } = apiClient.useQuery<ReportResponse>({
    key: ["report", interviewId],
    url: ENDPOINTS.ANALYSIS.GET_SUMMARY_REPORT(interviewId || ""),
    enabled: !!interviewId,
  });

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error || !reportData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error">Error</h1>
          <p className="text-base-content/70">Failed to load report data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {reportData?.track
            ? `${reportData?.track} Interview Summary Report`
            : "Web Development Interview Summary Report"}
        </h1>
      </div>

      <SummaryOverview
        interviewId={reportData.interviewId}
        candidateName={user?.authorizedUser?.name || "Unknown"}
        role={reportData?.track ?? "Web Developer"}
        date={reportData?.metadata?.generatedAt ?? ""}
      />

      <OverallScoreSummary
        knowledgeCompetence={reportData.overallScoreSummary.knowledgeCompetence}
        speechStructure={reportData.overallScoreSummary.speechStructure}
      />

      <FinalSummary
        strengths={reportData.finalSummary.strengths}
        areasOfImprovement={reportData.finalSummary.areasOfImprovement}
      />

      <ActionableSteps
        knowledgeDevelopment={reportData.actionableSteps.knowledgeDevelopment}
        speechStructureFluency={
          reportData.actionableSteps.speechStructureFluency
        }
      />

      <TopicHighlights
        strengthsTopics={reportData.topicHighlights.strengthsTopics}
        improvementTopics={reportData.topicHighlights.improvementTopics}
      />
    </div>
  );
};

export default ReportSummaryPage;
