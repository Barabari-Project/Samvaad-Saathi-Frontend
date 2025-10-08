"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  // Handle redirects using useEffect to avoid render-time side effects
  useEffect(() => {
    if (loading) {
      setShouldRedirect(null);
      return;
    }

    if (!user) {
      setShouldRedirect("/auth/signup");
      return;
    }

    if (user.authorizedUser.isOnboarded) {
      setShouldRedirect("/home");
      return;
    } else {
      setShouldRedirect("/onboarding");
      return;
    }
  }, [user, loading]);

  // Execute redirect when shouldRedirect state changes
  useEffect(() => {
    if (shouldRedirect) {
      router.push(shouldRedirect);
    }
  }, [shouldRedirect, router]);

  // Show loading state while determining where to redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading loading-spinner loading-lg"></div>
    </div>
  );
}
