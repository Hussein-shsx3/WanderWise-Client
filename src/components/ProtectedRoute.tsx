"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { Spinner } from "@/components/ui/feedback/Spinner";
import type { RootState } from "@/redux/store";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, token } = useAppSelector((state: RootState) => state.auth);

  // Add a delay to allow Redux persist to hydrate and tokens to be available
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated || !token) {
        router.push("/auth/login");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, token, router]);

  if (!isAuthenticated || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
};
