import axiosInstance from "@/lib/axios";
import {
  RegisterDTO,
  LoginDTO,
  VerifyEmailDTO,
  ResendVerificationDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  AuthResponse,
} from "@/types/auth";

export const authService = {
  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailDTO): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/verify", data);
    return response.data;
  },

  resendVerification: async (data: ResendVerificationDTO): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/resend-verification", data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordDTO): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordDTO): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/reset-password", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Clear tokens from cookies
    const { default: Cookies } = await import("js-cookie");
    Cookies.remove("authToken");
    Cookies.remove("refreshToken");
  },

  verifyAuth: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  },
};
