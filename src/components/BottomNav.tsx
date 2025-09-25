"use client";

import { HomeIcon, ListBulletIcon, UserIcon } from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";

/**
 * Bottom navigation bar with three primary actions: History, Home, Profile.
 * Automatically highlights the currently active route based on pathname.
 */
export default function BottomNav({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine which nav item should be active based on pathname
  const getActiveNav = () => {
    if (pathname.startsWith("/history")) return "history";
    if (pathname.startsWith("/home")) return "home";
    if (pathname.startsWith("/profile")) return "profile";
    return undefined;
  };

  const active = getActiveNav();
  const baseItemClass =
    "flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 hover:text-white";
  const isActive = (key: string) => active === key;

  return (
    <nav
      className={`fixed bottom-0 left-0 w-full h-16 bg-[#1F285B] rounded-t-[14px] flex justify-around items-center ${className}`}
      aria-label="Bottom Navigation"
    >
      <button
        className={`${baseItemClass} ${
          isActive("history") ? "text-white" : "text-gray-400"
        }`}
        onClick={() => router.push("/history")}
        aria-label="Go to history"
      >
        <ListBulletIcon className="w-7 h-7" />
      </button>

      <button
        className={`${baseItemClass} ${
          isActive("home") ? "text-white" : "text-gray-400"
        }`}
        onClick={() => router.push("/home")}
        aria-label="Go to home"
      >
        <HomeIcon className="w-7 h-7" />
      </button>

      <button
        className={`${baseItemClass} ${
          isActive("profile") ? "text-white" : "text-gray-400"
        }`}
        onClick={() => router.push("/profile")}
        aria-label="Go to profile"
      >
        <UserIcon className="w-7 h-7" />
      </button>
    </nav>
  );
}
