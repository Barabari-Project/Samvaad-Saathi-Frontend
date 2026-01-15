"use client";

import { createApiClient } from "@/lib/api-config/src/client";
import { APIServiceV2 } from "@/lib/api-config/src/config";
import { ENDPOINTS_V2 } from "@/lib/api-config/src/endpoints";
import { ROLE_OPTIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreatePronunciationPracticeRequest {
  difficulty: string;
  role: string;
}

interface Word {
  index: number;
  word: string;
  phonetic: string;
}

interface CreatePronunciationPracticeResponse {
  practiceId: number;
  difficulty: string;
  words: Word[];
  totalWords: number;
  status: string;
  createdAt: string;
}

const PronunciationPracticePage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const router = useRouter();

  const apiClient = createApiClient(APIServiceV2.INTERVIEWS);

  const { mutateAsync: createPronunciationPractice, isPending: isCreating } =
    apiClient.useMutation<
      CreatePronunciationPracticeResponse,
      CreatePronunciationPracticeRequest
    >({
      url: ENDPOINTS_V2.CREATE_PRONUNCIATION_PRACTICE,
      method: "post",
      successMessage: "Practice session created successfully!",
      errorMessage: "Failed to create practice session. Please try again.",
    });

  const handleGetStarted = async () => {
    if (!selectedRole || !difficulty) {
      return;
    }

    try {
      const response = await createPronunciationPractice({
        difficulty,
        role: selectedRole,
      });

      // Store the response in sessionStorage
      sessionStorage.setItem(
        "pronunciationPracticeData",
        JSON.stringify(response)
      );

      // Redirect to the start page
      router.push("/pronunciation-practice/start");
    } catch (error) {
      // Error handling is done by the mutation hooks with toast notifications
      console.error("Error creating pronunciation practice:", error);
    }
  };

  return (
    <div className="flex flex-col ">
      {/* Main Content */}
      <div className="flex flex-col gap-6 p-6 ">
        {/* Role Selection */}
        <div>
          <label className="block text-[14px] font-noto font-[500] text-black mb-2">
            Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="select select-bordered w-full bg-white border-gray-300 rounded-lg"
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

        {/* Difficulty Level */}
        <div className="space-y-3">
          <label className="block text-[14px] font-noto font-[500] text-black">
            Difficulty Level
          </label>
          <p className="text-[14px] text-black font-noto">
            Choose a difficulty level
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDifficulty("easy")}
              className={`px-4 py-3 rounded-lg font-noto text-[14px] text-black transition-all ${
                difficulty === "easy"
                  ? "bg-yellow-200 outline-2 outline-yellow-400"
                  : "bg-yellow-100 hover:bg-yellow-200"
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty("medium")}
              className={`px-4 py-3 rounded-lg font-noto text-[14px] text-black transition-all ${
                difficulty === "medium"
                  ? "bg-purple-200 outline-2 outline-purple-400"
                  : "bg-purple-100 hover:bg-purple-200"
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setDifficulty("hard")}
              className={`px-4 py-3 rounded-lg font-noto text-[14px] text-black col-span-2 transition-all ${
                difficulty === "hard"
                  ? "bg-pink-200 outline-2 outline-pink-400"
                  : "bg-pink-100 hover:bg-pink-200"
              }`}
            >
              Hard
            </button>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="pt-4 mt-auto">
          <button
            onClick={handleGetStarted}
            disabled={!selectedRole || !difficulty || isCreating}
            className={`w-full font-bold p-4 rounded-xl text-white transition-all ${
              !selectedRole || !difficulty || isCreating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {isCreating ? "Creating..." : "Get Started"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PronunciationPracticePage;
