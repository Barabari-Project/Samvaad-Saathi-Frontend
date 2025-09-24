"use client";

import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import { usePathname } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/onboarding";

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed nav bars - hidden during onboarding */}
      {!isOnboarding && <TopNav />}
      {/* Content area should scroll between top(64px) and bottom(64px) navs */}
      <main
        className={`${
          isOnboarding ? "pt-0 pb-0 px-0" : "pt-16 pb-16 px-8"
        } flex-1 overflow-y-auto`}
      >
        {children}
      </main>
      {!isOnboarding && <BottomNav />}
    </div>
  );
}
