"use client";

import ConcentricRadialProgress from "@/components/ConcentricRadialProgress";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface InterviewItem {
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

interface InterviewsListResponse {
  items: InterviewItem[];
  nextCursor: number | null;
  limit: number;
}

type InterviewStatus = "incomplete" | "completed";

export default function InterviewHistory() {
  const [activeTab, setActiveTab] = useState<InterviewStatus>("incomplete");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { useQuery } = createApiClient(APIService.INTERVIEWS);

  // Read tab from query params on component mount
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && (tabParam === "incomplete" || tabParam === "completed")) {
      setActiveTab(tabParam as InterviewStatus);
    }
  }, [searchParams]);

  // Helper function to update tab and query params
  const handleTabChange = (tab: InterviewStatus) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const {
    data: interviewsData,
    isLoading,
    error,
  } = useQuery<InterviewsListResponse>({
    key: [ENDPOINTS.INTERVIEWS.LIST, "list"],
    url: ENDPOINTS.INTERVIEWS.LIST,
    method: "get",
  });

  const { incomplete, completed } = useMemo(() => {
    if (!interviewsData?.items) {
      return { incomplete: [], completed: [] };
    }

    const incompleteInterviews: InterviewItem[] = [];
    const completedInterviews: InterviewItem[] = [];

    interviewsData.items.forEach((interview) => {
      if (interview.status === "active") {
        incompleteInterviews.push(interview);
      } else if (interview.status === "completed") {
        completedInterviews.push(interview);
      }
    });

    return {
      incomplete: incompleteInterviews,
      completed: completedInterviews,
    };
  }, [interviewsData]);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD MMM , YYYY");
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100dvh-56px)] py-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-[20px] font-semibold text-[#1F285B] mb-4">
            History
          </h2>
          <div className="flex justify-center items-center h-32">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100dvh-56px)] py-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-[20px] font-semibold text-[#1F285B] mb-4">
            History
          </h2>
          <div className="alert alert-error">
            <span>Failed to load interviews. Please try again.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-56px)] py-6">
      <div className="max-w-md mx-auto">
        <h2 className="text-[20px] font-semibold text-[#1F285B] mb-4">
          History
        </h2>

        <div
          role="tablist"
          className="tabs tabs-box mb-3 w-full bg-gray-200 p-2 font-bold text-2xl"
        >
          <a
            role="tab"
            className={`tab flex-1 ${
              activeTab === "incomplete"
                ? "tab-active shadow-2xl rounded-xl"
                : ""
            }`}
            onClick={() => handleTabChange("incomplete")}
          >
            Incomplete
          </a>
          <a
            role="tab"
            className={`tab flex-1 ${
              activeTab === "completed" ? "tab-active" : ""
            }`}
            onClick={() => handleTabChange("completed")}
          >
            Completed
          </a>
        </div>

        {activeTab === "incomplete" ? (
          <div>
            <p className="text-[12px] text-black/60 mb-3">
              This page lists all interviews you have put on hold.
            </p>

            {incomplete.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No incomplete interviews found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {incomplete.map((item) => (
                  <div
                    key={item.interviewId}
                    className="bg-white rounded-xl shadow-lg p-4 relative"
                  >
                    {/* Role Title - Top Left */}
                    <h3 className="text-lg font-bold text-black mb-2">
                      {item.track}
                    </h3>

                    {/* Date and Attempt - Below Title */}
                    <p className="text-sm text-black mb-4">
                      {formatDate(item.createdAt)} / Attempt-1
                    </p>

                    {/* Difficulty Label - Top Right */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`badge badge-xs badge-soft ${
                          item.difficulty?.toLowerCase() === "hard"
                            ? "badge-error"
                            : item.difficulty?.toLowerCase() === "easy"
                            ? "badge-success"
                            : item.difficulty?.toLowerCase() === "medium"
                            ? "badge-warning"
                            : "badge-neutral"
                        }`}
                      >
                        {item.difficulty?.toUpperCase()}
                      </span>
                    </div>

                    {/* Complete Interview Button - Bottom Right */}
                    <div className="flex justify-end">
                      <Link
                        href={`/interview?interviewId=${item.interviewId}&useResume=${item.resumeUsed}`}
                        className="px-4 py-2 border border-black rounded-lg bg-white text-black font-bold text-sm hover:bg-gray-50 transition-colors"
                      >
                        Complete Interview
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-[12px] text-black/60 mb-3">
              Access Your Interview History
            </p>
            {completed.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No completed interviews found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completed.map((item) => (
                  <div
                    key={item?.interviewId}
                    className="bg-white rounded-xl shadow-lg p-4 relative"
                  >
                    {/* Role Title - Top Left */}
                    <h3 className="text-lg font-bold text-black mb-2">
                      {item?.track}
                    </h3>

                    {/* Date and Attempt - Below Title */}
                    <p className="text-sm text-black mb-4">
                      {formatDate(item?.createdAt)} / Attempt:{" "}
                      {item?.attemptsCount}
                    </p>

                    {/* Difficulty Label - Top Right */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`badge badge-xs badge-soft ${
                          item?.difficulty?.toLowerCase() === "hard"
                            ? "badge-error"
                            : item?.difficulty?.toLowerCase() === "easy"
                            ? "badge-success"
                            : item?.difficulty?.toLowerCase() === "medium"
                            ? "badge-warning"
                            : "badge-neutral"
                        }`}
                      >
                        {item?.difficulty?.toUpperCase()}
                      </span>
                    </div>

                    {/* Progress indicators */}
                    {(item?.knowledgePercentage !== undefined ||
                      item?.speechFluencyPercentage !== undefined) && (
                      <div className="flex items-center gap-4 mb-4">
                        <ConcentricRadialProgress
                          size={150}
                          rings={[
                            {
                              value: item.knowledgePercentage ?? 0,
                              color: "#3b82f6",
                              ariaLabel: "Technical Knowledge progress",
                              trackColor: "#3b82f6",
                            },
                            {
                              value: item.speechFluencyPercentage ?? 0,
                              color: "#6b7280",
                              ariaLabel: "Speech Fluency progress",
                              trackColor: "#6b7280",
                            },
                          ]}
                          centerRender={(rings) => (
                            <div className="leading-4">
                              <div className="text-sm text-blue-500">
                                {rings[0]?.value
                                  ? `${Math.round(rings[0].value)}%`
                                  : "-- %"}
                              </div>
                              <div className="text-sm">
                                {rings[1]?.value
                                  ? `${Math.round(rings[1].value)}%`
                                  : "-- %"}
                              </div>
                            </div>
                          )}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">
                            Total Average Score
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            Total no. of attempts - 1
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                              <span className="text-sm text-gray-700">
                                Technical Knowledge
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">
                                Speech Fluency
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* View Report Button - Bottom Right */}
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/reattempt-interview?interviewId=${item.interviewId}&role=${item.track}&attemptsCount=${item.attemptsCount}`}
                        className="btn btn-neutral btn-sm"
                      >
                        Reattempt
                      </Link>
                      <Link
                        href={`/report-summary?interviewId=${item.interviewId}`}
                        className="btn btn-outline btn-sm"
                      >
                        View Report
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
