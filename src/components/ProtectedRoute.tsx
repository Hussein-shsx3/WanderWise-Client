"use client";

import { useEffect, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { Spinner } from "@/components/ui/feedback/Spinner";
import type { RootState } from "@/redux/store";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, token } = useAppSelector(
    (state: RootState) => state.auth
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAuth = () => {
      // Check cookies first (most reliable source)
      const cookieToken = Cookies.get("authToken");

      if (cookieToken) {
        // Token exists in cookie, allow access
        setIsChecking(false);
        return;
      }

      // Fallback: Check Redux state
      if (isAuthenticated && token) {
        setIsChecking(false);
        return;
      }

      // Fallback: Check localStorage (Redux Persist)
      try {
        const persistedState = localStorage.getItem("persist:wanderwise-root");
        if (persistedState) {
          const parsed = JSON.parse(persistedState);
          const authState = JSON.parse(parsed.auth || "{}");
          if (authState?.token) {
            // Token exists in localStorage, restore to cookie
            Cookies.set("authToken", authState.token, {
              expires: 7,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
            });
            setIsChecking(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }

      // No token found anywhere, redirect to login
      router.push("/auth/login");
      setIsChecking(false);
    };

    // Add delay to ensure everything is loaded
    const timer = setTimeout(checkAuth, 300);
    return () => clearTimeout(timer);
  }, [isAuthenticated, token, router]);

  // Show spinner while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
};
