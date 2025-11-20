import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import { RegisterDTO, LoginDTO } from "@/types/auth";
import Cookies from "js-cookie";
import axios from "axios";

const handleAuthError = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return defaultMessage;
};

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterDTO, { rejectWithValue }) => {
    try {
      // Clear any previous user's data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:wanderwise-root");
      }

      const response = await authService.register(data);

      console.log("Register response:", response);

      if (response.success && response.token) {
        // Save token to cookies with secure settings
        Cookies.set("authToken", response.token, {
          expires: 7,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        if (response.refreshToken) {
          Cookies.set("refreshToken", response.refreshToken, {
            expires: 30,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }

        console.log(
          "Token saved to cookies:",
          Cookies.get("authToken")?.substring(0, 20)
        );
      }

      return response;
    } catch (error) {
      return rejectWithValue(handleAuthError(error, "Registration failed"));
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginDTO, { rejectWithValue }) => {
    try {
      // Clear any previous user's data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:wanderwise-root");
      }

      const response = await authService.login(data);

      console.log("Login response:", response);

      if (response.success && response.token) {
        // Save token to cookies with secure settings
        Cookies.set("authToken", response.token, {
          expires: 7,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        if (response.refreshToken) {
          Cookies.set("refreshToken", response.refreshToken, {
            expires: 30,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }

        console.log(
          "Token saved to cookies:",
          Cookies.get("authToken")?.substring(0, 20)
        );
      }

      return response;
    } catch (error) {
      return rejectWithValue(handleAuthError(error, "Login failed"));
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();

      // Clear cookies
      Cookies.remove("authToken");
      Cookies.remove("refreshToken");

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:wanderwise-root");
      }

      console.log("Logout successful - tokens cleared");

      return null;
    } catch (error) {
      return rejectWithValue(handleAuthError(error, "Logout failed"));
    }
  }
);
