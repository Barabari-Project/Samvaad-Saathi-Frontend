"use client";
import { useState } from "react";

interface Step1Props {
  onNext: (data: { degree: string; university: string }) => void;
}

export default function Step1({ onNext }: Step1Props) {
  const [degree, setDegree] = useState("");
  const [university, setUniversity] = useState("");

  const degrees = [
    "BBA",
    "BCA",
    "Bcom Computers",
    "BSc Al/ML",
    "BSc Computer Science",
    "BSc Life Science",
  ];
  const universities = [
    "GDC Begumpet",
    "GDC Nampally",
    "Government City College",
    "GDC Husaini Alam",
    "GDC Narayanguda",
  ];

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-50 to-purple-50 px-4 pt-10 text-left font-inter">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-[36px] font-[700] font-noto text-gray-800">
          Education Details
        </h2>
      </div>

      {/* Form Container */}
      <div className="max-w-md mx-auto  p-8 mb-8">
        {/* Degree Dropdown */}
        <div className="mb-6">
          <label className="block mb-3 text-[16px] font-noto font-[600] text-gray-800">
            Degree
          </label>
          <select
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="select select-bordered w-full h-[60px] text-gray-800 font-noto text-[16px] rounded-xl"
          >
            <option value="" disabled>
              Select Degree
            </option>
            {degrees.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* University Dropdown */}
        <div className="mb-6">
          <label className="block mb-3 text-[16px] font-noto font-[600] text-gray-800">
            University
          </label>
          <select
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="select select-bordered w-full h-[60px] text-gray-800 font-noto text-[16px] rounded-xl"
          >
            <option value="" disabled>
              Select University
            </option>
            {universities.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onNext({ degree, university })}
          disabled={!degree || !university}
          className="btn btn-neutral btn-block p-6 rounded-xl mt-6"
        >
          Continue to Next Step
        </button>
      </div>
    </div>
  );
}
