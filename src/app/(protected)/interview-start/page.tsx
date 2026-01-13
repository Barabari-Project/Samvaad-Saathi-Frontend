"use client";

import { createApiClient } from "@/lib/api-config/src/client";
import { APIServiceV2 } from "@/lib/api-config/src/config";
import { ENDPOINTS, ENDPOINTS_V2 } from "@/lib/api-config/src/endpoints";
import { ROLE_OPTIONS } from "@/lib/constants";
import {
  trackDifficultySelected,
  trackResumeToggleClick,
  trackRoleSelected,
  trackStartInterviewButtonClick,
} from "@/lib/posthog/tracking.utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CreateInterviewRequest {
  track: string;
  difficulty: string;
}

interface CreateInterviewResponse {
  interviewId: string;
}

const DIFFICULTY_LEVEL = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
  { key: "expert", label: "Expert" },
];

export default function InterviewStartPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [useResume, setUseResume] = useState(false);

  const router = useRouter();

  const apiClient = createApiClient(APIServiceV2.INTERVIEWS);

  const { mutateAsync: createInterview, isPending: isCreatingInterview } =
    apiClient.useMutation<CreateInterviewResponse, CreateInterviewRequest>({
      url: ENDPOINTS_V2.CREATE_INTERVIEW,
      method: "post",
      successMessage: "Interview created successfully!",
      errorMessage: "Failed to create interview. Please try again.",
      options: {
        onSuccess: (data) => {
          // Navigate to the interview page with query params
          const interviewId = data.interviewId;
          if (interviewId) {
            router.push(
              `/interview?interviewId=${interviewId}&useResume=${useResume}&role=${encodeURIComponent(
                selectedRole
              )}`
            );
          }
        },
      },
      keyToInvalidate: {
        queryKey: [
          ENDPOINTS.AUTH.ABOUT_ME,
          ENDPOINTS.INTERVIEWS.LIST,
          ENDPOINTS.INTERVIEWS.WITH_SUMMARY,
        ],
      },
    });

  const handleToggleResume = (checked: boolean) => {
    setUseResume(checked);
    trackResumeToggleClick(checked);

    if (checked) {
      toast.success("Resume will be considered for this interview");
    } else {
      toast.error("Resume will not be considered for this interview");
    }
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      // You could add toast notification here
      return;
    }

    // Track start interview button click
    trackStartInterviewButtonClick(selectedRole, difficulty, useResume);

    try {
      // Create the interview and redirect on success
      await createInterview({
        track: selectedRole,
        difficulty: difficulty,
      });
    } catch (error) {
      // Error handling is done by the mutation hooks with toast notifications
      console.error("Error in interview creation:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="space-y-2">
        <h2 className="text-center text-[20px] font-bold leading-6">
          Select Your Interview
        </h2>
        <h2 className="text-center text-[20px] font-bold leading-6">
          Preferences
        </h2>
      </div>

      <div>
        <label className="block text-[14px] font-noto font-[500] text-black mb-2">
          Role
        </label>
        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            trackRoleSelected(e.target.value);
          }}
          className="select select-bordered w-full"
        >
          <option value="" disabled>
            Select a role
          </option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-[14px] font-noto font-[500] text-black">
          Difficulty Level
        </label>

        <div className="space-y-2">
          {DIFFICULTY_LEVEL.map((opt) => (
            <label
              key={opt.key}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="difficulty"
                value={opt.key}
                checked={difficulty === opt.key}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  trackDifficultySelected(e.target.value);
                }}
                className="radio radio-sm"
              />
              <span className="text-[14px] text-black font-noto">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <label className="text-[14px] font-noto font-[500] text-black">
              Use Resume for Interview
            </label>
            <span className="text-[12px] text-gray-600 font-noto">
              {useResume
                ? "Resume will be considered for this interview"
                : "Resume will not be considered for this interview"}
            </span>
          </div>

          <input
            type="checkbox"
            checked={useResume}
            onChange={(e) => handleToggleResume(e.target.checked)}
            className="toggle toggle-sm"
            aria-label="Toggle resume usage"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={isCreatingInterview || !selectedRole}
          className={`w-full font-bold p-4 rounded-xl ${
            isCreatingInterview || !selectedRole
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {isCreatingInterview ? "Starting Interview..." : "Start Interview"}
        </button>
      </div>
    </div>
  );
}
