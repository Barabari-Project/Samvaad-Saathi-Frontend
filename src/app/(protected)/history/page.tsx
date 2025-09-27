"use client";

import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo, useState } from "react";

interface InterviewItem {
  interviewId: number;
  track: string;
  difficulty: string;
  status: string;
  createdAt: string;
}

interface InterviewsListResponse {
  items: InterviewItem[];
  nextCursor: number | null;
  limit: number;
}

type InterviewStatus = "incomplete" | "completed";

export default function InterviewHistory() {
  const [activeTab, setActiveTab] = useState<InterviewStatus>("incomplete");
  const { useQuery } = createApiClient(APIService.INTERVIEWS);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "hard":
        return "text-red-600";
      case "easy":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
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
            onClick={() => setActiveTab("incomplete")}
          >
            Incomplete
          </a>
          <a
            role="tab"
            className={`tab flex-1 ${
              activeTab === "completed" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("completed")}
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
                        className={`text-sm font-medium capitalize ${getDifficultyColor(
                          item.difficulty
                        )}`}
                      >
                        {item.difficulty?.toUpperCase()}
                      </span>
                    </div>

                    {/* Complete Interview Button - Bottom Right */}
                    <div className="flex justify-end">
                      <Link
                        href={`/interview?interviewId=${item.interviewId}&useResume=false`}
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
                        className={`text-sm font-medium capitalize ${getDifficultyColor(
                          item.difficulty
                        )}`}
                      >
                        {item.difficulty?.toUpperCase()}
                      </span>
                    </div>

                    {/* View Report Button - Bottom Right */}
                    <div className="flex justify-end">
                      <Link
                        href={`/report-summary?interviewId=${item.interviewId}`}
                        className="px-4 py-2 border border-black rounded-lg bg-white text-black font-bold text-sm hover:bg-gray-50 transition-colors"
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
