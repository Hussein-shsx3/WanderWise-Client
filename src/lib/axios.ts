import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get token from cookies first
    let token = Cookies.get("authToken");

    // If not in cookies, try to get from localStorage (Redux Persist)
    if (!token && typeof window !== "undefined") {
      try {
        const persistedState = localStorage.getItem("persist:wanderwise-root");
        if (persistedState) {
          const authState = JSON.parse(JSON.parse(persistedState).auth || "{}");
          token = authState.token;
        }
      } catch (error) {
        console.error("Error reading token from localStorage:", error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear all auth data
      Cookies.remove("authToken");
      Cookies.remove("refreshToken");

      // Clear Redux persist
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("persist:wanderwise-root");
        } catch (err) {
          console.error("Error clearing localStorage:", err);
        }
      }

      // Redirect to login if not already there
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/auth/login")
      ) {
        window.location.href = "/auth/login";
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/auth/login")
      ) {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
