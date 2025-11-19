"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

/**
 * Hook to check authentication status by reading cookies
 * This is used as a fallback when Redux state might not be rehydrated yet
 */
export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read token from cookies on client side
    const authToken = Cookies.get("authToken");
    setToken(authToken || null);
    setIsLoading(false);
  }, []);

  return { token, isLoading };
}
