import ConcentricRadialProgress from "@/components/ConcentricRadialProgress";
import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { InterviewItem } from "./types";

interface CompletedInterviewCardProps {
  item: InterviewItem;
}

export default function CompletedInterviewCard({
  item,
}: CompletedInterviewCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 relative">
      {/* Role Title - Top Left */}
      <h3 className="text-lg font-bold text-black mb-2">{item?.track}</h3>

      {/* Date and Attempt - Below Title */}
      <p className="text-sm text-black mb-4">
        {formatDate(item?.createdAt)} / Attempt: {item?.attemptsCount ?? 0}
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
                  {rings[0]?.value ? `${Math.round(rings[0].value)}%` : "-- %"}
                </div>
                <div className="text-sm">
                  {rings[1]?.value ? `${Math.round(rings[1].value)}%` : "-- %"}
                </div>
              </div>
            )}
          />
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">Total Average Score</p>
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
                <span className="text-sm text-gray-700">Speech Fluency</span>
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
  );
}
