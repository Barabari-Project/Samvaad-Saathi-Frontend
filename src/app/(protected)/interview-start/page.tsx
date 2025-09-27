"use client";

import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
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

export default function InterviewStartPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [useResume, setUseResume] = useState(false);
  const router = useRouter();

  const apiClient = createApiClient(APIService.INTERVIEWS);

  const createInterviewMutation = apiClient.useMutation<
    CreateInterviewResponse,
    CreateInterviewRequest
  >({
    url: ENDPOINTS.INTERVIEWS.CREATE,
    method: "post",
    successMessage: "Interview created successfully!",
    errorMessage: "Failed to create interview. Please try again.",
    options: {
      onSuccess: (data) => {
        // Navigate to the interview page with query params
        const interviewId = data.interviewId;
        if (interviewId) {
          router.push(
            `/interview?interviewId=${interviewId}&useResume=${useResume}`
          );
        }
      },
    },
  });

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full-Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
  ];

  const handleToggleResume = (checked: boolean) => {
    setUseResume(checked);

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

    try {
      // Create the interview and redirect on success
      await createInterviewMutation.mutateAsync({
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
          onChange={(e) => setSelectedRole(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="" disabled>
            Select a role
          </option>
          {roles.map((role) => (
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
          {[
            { key: "easy", label: "Easy" },
            { key: "medium", label: "Medium" },
            { key: "hard", label: "Hard" },
          ].map((opt) => (
            <label
              key={opt.key}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="difficulty"
                value={opt.key}
                checked={difficulty === opt.key}
                onChange={(e) => setDifficulty(e.target.value)}
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
          disabled={createInterviewMutation.isPending || !selectedRole}
          className={`w-full font-bold p-4 rounded-xl ${
            createInterviewMutation.isPending || !selectedRole
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {createInterviewMutation.isPending
            ? "Starting Interview..."
            : "Start Interview"}
        </button>
      </div>
    </div>
  );
}
