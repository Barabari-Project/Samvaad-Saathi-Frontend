import DifficultyTag from "@/components/DifficultyTag";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { InterviewItem } from "./types";

interface IncompleteInterviewCardProps {
  item: InterviewItem;
  onCompleteInterview: (interviewId: number) => Promise<void>;
}

export default function IncompleteInterviewCard({
  item,
  onCompleteInterview,
}: IncompleteInterviewCardProps) {
  const [isResumingInterview, setIsResumingInterview] = useState(false);

  const handleCompleteInterview = async () => {
    setIsResumingInterview(true);
    try {
      await onCompleteInterview(item.interviewId);
    } finally {
      setIsResumingInterview(false);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 relative">
      {/* Role Title - Top Left */}
      <h3 className="text-lg font-bold text-black mb-2">{item.track}</h3>

      {/* Date and Attempt - Below Title */}
      <p className="text-sm text-black mb-4">
        {formatDate(item.createdAt)} / Attempt-{item?.attemptsCount ?? 0}
      </p>

      {/* Difficulty Label - Top Right */}
      <div className="absolute top-4 right-4">
        <DifficultyTag difficulty={item.difficulty} />
      </div>

      {/* Complete Interview Button - Bottom Right */}
      <div className="flex justify-end">
        <button
          onClick={handleCompleteInterview}
          disabled={isResumingInterview}
          className="px-4 py-2 border border-black rounded-lg bg-white text-black font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResumingInterview ? (
            <>
              <span className="loading loading-spinner loading-xs mr-2"></span>
              Resuming...
            </>
          ) : (
            "Complete Interview"
          )}
        </button>
      </div>
    </div>
  );
}
