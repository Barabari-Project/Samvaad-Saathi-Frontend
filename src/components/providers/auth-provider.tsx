"use client";

import { apiClient, ENDPOINTS } from "@/lib/api-config";
import { UserProfile } from "@/lib/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithCognito: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cookies, , removeCookie] = useCookies(["token", "refresh_token"]);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  const { data: user, isLoading: loading } = apiClient.useQuery<UserProfile>({
    key: [ENDPOINTS.AUTH.ABOUT_ME],
    url: ENDPOINTS.AUTH.ABOUT_ME,
    // Only make the query if we have a token
    enabled: !!cookies.token,
  });

  // Handle redirects using useEffect to avoid render-time side effects
  useEffect(() => {
    const token = cookies.token;
    const refreshToken = cookies.refresh_token;

    // If no token or refresh token exists, redirect to signup
    if (!token && !refreshToken) {
      setShouldRedirect("/auth/signup");
      return;
    }

    // If we have both tokens but no user data yet, let the main page handle the routing
    // This prevents unnecessary redirects while user data is being fetched
    if (token && refreshToken && !user && loading) {
      setShouldRedirect(null);
      return;
    }

    // If user is loaded and NOT onboarded, redirect to onboarding
    if (user && !loading && !user.authorizedUser.isOnboarded) {
      setShouldRedirect("/onboarding");
      return;
    }

    // Clear any pending redirects if conditions don't match
    setShouldRedirect(null);
  }, [cookies.token, cookies.refresh_token, user, loading]);

  // Execute redirect when shouldRedirect state changes
  useEffect(() => {
    if (shouldRedirect) {
      router.push(shouldRedirect);
    }
  }, [shouldRedirect, router]);

  const signInWithCognito = () => {
    window.location.href = `api${ENDPOINTS.AUTH.COGNITO_LOGIN}`;
  };

  const signOut = () => {
    // Clear all cookies
    removeCookie("token", { path: "/" });
    removeCookie("refresh_token", { path: "/" });

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.clear();
    }

    // Clear sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }

    // Clear all query cache
    queryClient.clear();

    // Redirect to signup page
    router.push("/auth/signup");
  };

  const value: AuthContextType = {
    user: user ?? null,
    loading,
    signInWithCognito,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
