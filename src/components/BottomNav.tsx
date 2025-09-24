"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

/**
 * Bottom navigation bar with three primary actions: History, Home, Profile.
 * Highlights the currently active route via `active` prop.
 */
export default function BottomNav({
  active,
  className = "",
}: {
  active?: "history" | "home" | "profile",
  className?: string,
}) {
  const router = useRouter();

  const baseItemClass = "flex flex-col items-center justify-center";
  const isActive = (key: string) => active === key;

  return (
    <nav
      className={`fixed bottom-0 left-0 w-full h-16 bg-[#1F285B] rounded-t-[14px] flex justify-around items-center ${className}`}
      aria-label="Bottom Navigation"
    >
      <button
        className={`${baseItemClass} ${
          isActive("history") ? "opacity-100" : "opacity-80"
        }`}
        onClick={() => router.push("/history")}
        aria-label="Go to history"
      >
        <Image src="/history-icon.png" alt="History" width={28} height={28} />
      </button>

      <button
        className={`${baseItemClass} ${
          isActive("home") ? "opacity-100" : "opacity-80"
        }`}
        onClick={() => router.push("/home")}
        aria-label="Go to home"
      >
        <Image src="/home-icon.png" alt="Home" width={28} height={28} />
      </button>

      <button
        className={`${baseItemClass} ${
          isActive("profile") ? "opacity-100" : "opacity-80"
        }`}
        onClick={() => router.push("/profile")}
        aria-label="Go to profile"
      >
        <Image src="/user-icon.png" alt="Profile" width={28} height={28} />
      </button>
    </nav>
  );
}
