"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/buttons/Button";
import { Toast } from "@/components/ui/feedback/Toast";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { Mail, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { authService } from "@/services/authService";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/slices/authSlice";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "idle"
  >("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        setStatus("loading");
        const response = await authService.verifyEmail({ token });

        if (response.success) {
          setStatus("success");
          setMessage(response.message);

          // Update Redux with verified user
          if (response.user && response.token) {
            Cookies.set("authToken", response.token, { expires: 7 });
            if (response.refreshToken) {
              Cookies.set("refreshToken", response.refreshToken, {
                expires: 30,
              });
            }

            dispatch(
              setAuth({
                user: response.user,
                token: response.token,
                refreshToken: response.refreshToken,
              })
            );

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          }
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error?.message || "Verification failed. Please try again."
        );
        setEmail(error?.email || "");
      }
    };

    verifyEmail();
  }, [token, router, dispatch]);

  const handleResendVerification = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      setResendLoading(true);
      const response = await authService.resendVerification({ email });

      if (response.success) {
        setMessage("Verification email sent! Check your inbox.");
        setStatus("idle");
      }
    } catch (error: any) {
      setMessage(
        error?.message || "Failed to resend verification email"
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        </div>
      </div>

      <Container maxWidth="sm" className="relative z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
              <Mail size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white mb-2">
              {status === "success" ? "Email Verified!" : "Verify Your Email"}
            </h1>
            <p className="text-white/70">
              {status === "loading"
                ? "Verifying your email address..."
                : status === "success"
                  ? "Your account is now active"
                  : "Complete your registration"}
            </p>
          </div>

          {/* Loading State */}
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner />
              <p className="text-white/60 mt-4">Please wait...</p>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 mb-4 animate-bounce">
                  <CheckCircle size={40} className="text-white" />
                </div>
                <p className="text-white text-center text-lg font-medium">
                  {message}
                </p>
              </div>

              <Button
                size="lg"
                variant="primary"
                className="w-full group"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition"
                />
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border border-red-500/50 mb-4">
                  <AlertCircle size={40} className="text-red-400" />
                </div>
                <p className="text-red-300 text-center text-lg">{message}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <Button
                  size="lg"
                  variant="primary"
                  className="w-full"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                >
                  {resendLoading ? "Sending..." : "Resend Verification Email"}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full bg-white/10 text-white border-white/30 hover:bg-white hover:text-blue-600"
                  onClick={() => router.push("/auth/login")}
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}

          {/* Idle State */}
          {status === "idle" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-white/70 text-center">
                  Click the link in your email to verify your account
                </p>
              </div>

              <Button
                size="lg"
                variant="outline"
                className="w-full bg-white/10 text-white border-white/30 hover:bg-white hover:text-blue-600"
                onClick={() => router.push("/auth/login")}
              >
                Back to Login
              </Button>
            </div>
          )}

          {/* Info Message */}
          {message && status !== "idle" && (
            <Toast
              type={status === "success" ? "success" : "error"}
              message={message}
              duration={status === "success" ? 3000 : undefined}
            />
          )}
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>
            Check your spam folder if you don't see the verification email
          </p>
        </div>
      </Container>
    </div>
  );
}
