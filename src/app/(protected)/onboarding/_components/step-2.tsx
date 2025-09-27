"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast from "react-hot-toast";

interface Step2Props {
  onNext: (data: {
    target_position: string;
    years_experience: string;
    resume: File | null;
  }) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function Step2({
  onNext,
  onBack,
  isLoading = false,
}: Step2Props) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack",
    "UI/UX Designer",
  ];
  const experiences = ["Fresher", "1-2 years", "2-5 years", "5+ years"];

  const handleSubmit = () => {
    onNext({
      target_position: role,
      years_experience: experience,
      resume,
    });
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      // max 5MB
      setResume(file);
    } else if (file) {
      toast.error("File size must be less than 5MB");
    }
  };

  const handleRemoveResume = () => {
    setResume(null);
    // Reset the file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-purple-50 to-blue-50 px-4 pt-10 font-inter">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-[36px] font-[700] font-noto text-gray-800">
          Career Setup
        </h2>
      </div>
      {/* Form Container */}
      <div className="max-w-md mx-auto  p-8 ">
        {/* Target Role Dropdown */}
        <div className="mb-6">
          <label className="block mb-3 text-[16px] font-noto font-[600] text-gray-800">
            Target Position / Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="select select-bordered w-full h-[60px] text-gray-800 font-noto text-[16px] rounded-xl"
          >
            <option value="" disabled>
              Select Role
            </option>
            {roles.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Dropdown */}
        <div className="mb-6">
          <label className="block mb-3 text-[16px] font-noto font-[600] text-gray-800">
            Experience Level
          </label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="select select-bordered w-full h-[60px] text-gray-800 font-noto text-[16px] rounded-xl"
          >
            <option value="" disabled>
              Select Experience Level
            </option>
            {experiences.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Resume Upload */}
        <div className="mb-6">
          <label className="block mb-3 text-[16px] font-noto font-[600] text-gray-800">
            Resume (Optional, Max 5MB)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="file-input file-input-bordered w-full h-[60px] text-gray-800 font-noto text-[16px] rounded-xl"
          />
          {resume && (
            <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-[14px] text-green-600 font-medium flex items-center">
                <span className="mr-2">✓</span>
                {resume.name}
              </p>
              <button
                type="button"
                onClick={handleRemoveResume}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Remove file"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!role || !experience || isLoading}
          className={`flex-1 py-6 rounded-xl btn btn-neutral btn-block mt-6 ${
            role && experience && !isLoading
              ? " hover:shadow-lg"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
}
