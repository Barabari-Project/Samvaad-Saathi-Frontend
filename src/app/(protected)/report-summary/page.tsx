"use client";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import { SCREEN_VIEW } from "@/lib/posthog/events";
import { trackScreenView } from "@/lib/posthog/tracking.utils";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FinalSummary from "./_components/FinalSummary";
import OverallScoreSummary from "./_components/OverallScoreSummary";
import PerQuestionAnalysis from "./_components/PerQuestionAnalysis";
import SkeletonLoader from "./_components/SkeletonLoader";
import SummaryOverview from "./_components/SummaryOverview";
import { ReportResponse } from "./_components/types";

type ReportTab = "per-question" | "final-summary";

const ReportSummaryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const [activeTab, setActiveTab] = useState<ReportTab>("per-question");

  const apiClient = createApiClient(APIService.ANALYSIS);

  const scrollToSection = (sectionId: string, tab: ReportTab) => {
    setActiveTab(tab);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const {
    data: reportData,
    isLoading,
    error,
  } = apiClient.useQuery<ReportResponse>({
    key: ["report", interviewId],
    url: ENDPOINTS.ANALYSIS.GET_SUMMARY_REPORT(interviewId || ""),
    enabled: !!interviewId,
  });

  useEffect(() => {
    trackScreenView(SCREEN_VIEW.OVERALL_REPORT_PAGE, interviewId || "");
  }, [interviewId]);

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
    <div className="space-y-6 py-4 sm:py-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {reportData.candidateInfo.roleTopic
            ? `${reportData.candidateInfo.roleTopic} Interview Summary Report`
            : "Interview Summary Report"}
        </h1>
      </div>

      <SummaryOverview
        candidateName={reportData.candidateInfo.name}
        role={reportData.candidateInfo.roleTopic}
        date={reportData.candidateInfo.interviewDate}
      />

      <OverallScoreSummary
        knowledgeCompetence={reportData.scoreSummary.knowledgeCompetence}
        speechAndStructure={reportData.scoreSummary.speechAndStructure}
      />

      <div
        role="tablist"
        className="tabs tabs-box mb-3 w-full bg-gray-200 p-2 font-bold text-2xl"
      >
        <a
          role="tab"
          className={`tab flex-1 ${
            activeTab === "per-question"
              ? "tab-active shadow-2xl rounded-xl"
              : ""
          }`}
          onClick={() =>
            scrollToSection("per-question-analysis", "per-question")
          }
        >
          Per Question Analysis
        </a>
        <a
          role="tab"
          className={`tab flex-1 ${
            activeTab === "final-summary"
              ? "tab-active shadow-2xl rounded-xl"
              : ""
          }`}
          onClick={() => scrollToSection("final-summary", "final-summary")}
        >
          Speech Summary
        </a>
      </div>

      <PerQuestionAnalysis questionAnalysis={reportData.questionAnalysis} />

      <FinalSummary speechFluency={reportData.overallFeedback.speechFluency} />
    </div>
  );
};

export default ReportSummaryPage;
