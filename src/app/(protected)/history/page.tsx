"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type OngoingItem = {
  id: string;
  role: string;
  date: string;
  attemptLabel: string;
  difficulty: "Easy" | "Medium" | "Hard";
  knowledgePercent: number;
  fluencyPercent: number;
};

type CompletedItem = {
  id: string;
  role: string;
  attemptsCount: number;
};

const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-pressed={isActive}
    className={`min-w-[120px] h-10 px-4 rounded-md text-sm font-medium transition shadow-sm border ${
      isActive
        ? "bg-white text-black border-black/10"
        : "bg-[#F1F1F1] text-black/80 border-black/10"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default function InterviewHistory() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    "ongoing"
  );

  const ongoing = useMemo<OngoingItem[]>(
    () => [
      {
        id: "r1",
        role: "React Developer",
        date: "13 Dec",
        attemptLabel: "2025/Q3 • Attempt 3",
        difficulty: "Hard",
        knowledgePercent: 90,
        fluencyPercent: 75,
      },
      {
        id: "r2",
        role: "Backend Developer",
        date: "11 Dec",
        attemptLabel: "2025/Q3 • Attempt 1",
        difficulty: "Easy",
        knowledgePercent: 75,
        fluencyPercent: 65,
      },
    ],
    []
  );

  const completed = useMemo<CompletedItem[]>(
    () => [
      { id: "c1", role: "React Developer", attemptsCount: 8 },
      { id: "c2", role: "Backend Developer", attemptsCount: 6 },
    ],
    []
  );

  return (
    <div className="min-h-[calc(100dvh-56px)] py-6">
      <div className="max-w-md mx-auto">
        <h2 className="text-[20px] font-semibold text-[#1F285B] mb-4">
          History
        </h2>

        <div className="flex items-center gap-3 mb-3">
          <TabButton
            label="Ongoing"
            isActive={activeTab === "ongoing"}
            onClick={() => setActiveTab("ongoing")}
          />
          <TabButton
            label="Completed"
            isActive={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
          />
        </div>

        {activeTab === "ongoing" ? (
          <div>
            <p className="text-[12px] text-black/60 mb-3">
              This page lists all interviews you have put on hold.
            </p>

            <div className="space-y-3">
              {ongoing.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-black/10 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Progress placeholder circle */}
                    <div className="relative w-16 h-16 rounded-full bg-[#EFF3FF] border-2 border-[#1F285B]/20 flex items-center justify-center">
                      <div className="text-[10px] text-[#1F285B] text-center leading-3">
                        <div>{item.knowledgePercent}%</div>
                        <div className="text-black/50">
                          {item.fluencyPercent}%
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[14px] font-semibold truncate">
                            {item.role}
                          </p>
                          <p className="text-[10px] text-black/60">
                            {item.date} • {item.attemptLabel}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#1F285B] inline-block" />
                            <span className="text-[10px] text-black/60">
                              Theoretical Knowledge
                            </span>
                            <span className="w-2 h-2 rounded-full bg-black/50 inline-block ml-3" />
                            <span className="text-[10px] text-black/60">
                              Speech Fluency
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] ml-2 ${
                            item.difficulty === "Hard"
                              ? "text-red-600"
                              : item.difficulty === "Easy"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {item.difficulty}
                        </span>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Link
                          href={`/interview?id=${item.id}`}
                          className="px-4 h-9 rounded-md bg-black text-white text-sm inline-flex items-center"
                        >
                          Resume
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[12px] text-black/60 mb-3">
              Access your interview history
            </p>
            <div className="space-y-3">
              {completed.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-black/10 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-3"
                >
                  <p className="text-[14px] font-semibold">{item.role}</p>
                  <p className="text-[12px] text-black/80 mt-1">
                    No. of Interviews attempted:{" "}
                    <span className="font-medium">{item.attemptsCount}</span>
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Link
                      href={`/interview-completed?id=${item.id}`}
                      className="px-4 h-9 rounded-md bg-white border text-sm inline-flex items-center shadow-sm"
                    >
                      View Report
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
