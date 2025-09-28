"use client";

import { cn } from "@/lib/utils";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";

/**
 * Top navigation bar specifically for interview pages.
 * Displays the role being interviewed for and a speaker icon.
 */
export default function InterviewTopNav({
  role,
  className = "",
}: {
  role?: string;
  className?: string;
}) {
  return (
    <div className="fixed top-0 left-0 w-full">
      <div
        className={cn(
          "flex items-center justify-between gap-2 p-4 bg-white",
          className
        )}
      >
        <h2 className="text-lg font-bold text-primary">{role}</h2>
        <SpeakerWaveIcon className="w-6 h-6 text-primary" />
      </div>
    </div>
  );
}
