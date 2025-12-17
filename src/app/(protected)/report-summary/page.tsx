"use client";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import { SCREEN_VIEW } from "@/lib/posthog/events";
import { trackScreenView } from "@/lib/posthog/tracking.utils";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
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

      <div className="card bg-base-200 rounded-xl shadow-md">
        <div className="card-body gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center bg-base-100">
                <ClipboardDocumentIcon className="w-7 h-7 text-base-content" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base-content text-lg">
                Recommended Practice Exercise
              </h3>
              <p className="text-base-content/70 text-sm">
                Let&apos;s fine-tune your interview structure skills.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="btn btn-primary text-white">
              Practice Now
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <FinalSummary speechFluency={reportData.overallFeedback.speechFluency} />

      {/* Speaker Analysis Section */}
      <div className="card bg-base-100 rounded-xl shadow-md">
        <div className="card-body flex-row items-center gap-4 p-6">
          <div className="flex-shrink-0">
            <div className="text-6xl">😊</div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base-content text-md mb-2">
              You are a Clear but Structurally Inconsistent Speaker
            </h3>
            <p className="text-base-content/70">
              You communicate ideas clearly, but lack of mental structuring
              causes pauses and loss of flow.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold text-base-content mb-2">
            Your Next Steps to Mastering the{" "}
            {reportData.candidateInfo.roleTopic || "Role"}
          </h2>
          <div className="border-t-2 border-dotted border-primary"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Practice Card 1 */}
          <div className="card bg-base-200 rounded-xl shadow-md">
            <div className="card-body gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center bg-base-100">
                    <ClipboardDocumentIcon className="w-7 h-7 text-base-content" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base-content">
                    Master Your Pronunciation
                  </h3>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary text-white">
                  Practice Now
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Practice Card 2 */}
          <div className="card bg-base-200 rounded-xl shadow-md">
            <div className="card-body gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center bg-base-100">
                    <ClipboardDocumentIcon className="w-7 h-7 text-base-content" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base-content">
                    Replace Fillers with Silent Pauses
                  </h3>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary text-white">
                  Practice Now
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Tip Section */}
      <div className="space-y-3">
        <h2 className="font-bold text-base-content text-xl">Final Tip</h2>
        <p className="text-base-content/70">
          Fluency improves faster from better thinking than better speaking —
          structure the answer first, and smooth delivery will follow naturally.
        </p>
      </div>
    </div>
  );
};

export default ReportSummaryPage;
