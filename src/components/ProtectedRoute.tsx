"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useAuthToken } from "@/hooks/useAuthToken";
import { Spinner } from "@/components/ui/feedback/Spinner";
import type { RootState } from "@/redux/store";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated: reduxAuth, token: reduxToken } = useAppSelector((state: RootState) => state.auth);
  const { token: cookieToken, isLoading: cookieLoading } = useAuthToken();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark that we've done initial client-side setup
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Wait for hydration and cookie check to complete
    if (!isHydrated || cookieLoading) {
      return;
    }

    // Check if user is authenticated
    const hasAuth = reduxAuth || !!reduxToken || !!cookieToken;

    // If not authenticated after hydration, redirect to login
    if (!hasAuth) {
      router.push("/auth/login");
    }
  }, [reduxAuth, reduxToken, cookieToken, isHydrated, cookieLoading, router]);

  // Show loading while hydrating or checking cookies
  if (!isHydrated || cookieLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Check if user has auth token from Redux or cookies
  const hasAuth = reduxAuth || !!reduxToken || !!cookieToken;

  // If not authenticated, render nothing (redirect already happened in effect)
  if (!hasAuth) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
};
