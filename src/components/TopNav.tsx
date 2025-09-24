"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

/**
 * Top navigation bar used across protected screens.
 * Renders a solid brand strip with an optional title on the left
 * and a settings icon button on the right.
 */
export default function TopNav({
  title,
  onSettingsClick,
  className = "",
}: {
  title?: string;
  onSettingsClick?: () => void;
  className?: string;
}) {
  const router = useRouter();

  const handleSettings = () => {
    if (onSettingsClick) return onSettingsClick();
    router.push("/settings");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-16 bg-[#1F285B] z-50 flex items-center px-4 ${className}`}
    >
      <div className="flex-1 flex items-center">
        {title ? (
          <h1 className="text-white text-[16px] font-semibold">{title}</h1>
        ) : (
          <span className="sr-only">Top Navigation</span>
        )}
      </div>
      <button
        aria-label="Open settings"
        className="w-10 h-10 flex items-center justify-center rounded-full"
        onClick={handleSettings}
      >
        <Image src="/settings.png" alt="Settings" width={20} height={20} />
      </button>
    </div>
  );
}
