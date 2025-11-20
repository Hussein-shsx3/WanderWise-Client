"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/buttons/Button";
import { Input } from "@/components/ui/forms/Input";
import { Toast } from "@/components/ui/feedback/Toast";
import { useLogin } from "@/hooks/useAuthQuery";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/slices/authSlice";
import { ArrowRight, Mail, Lock } from "lucide-react";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutate: login, isPending } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Valid email is required";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    login(formData, {
      onSuccess: (response) => {
        if (response.success && response.user && response.token) {
          // Store token in cookie
          Cookies.set("authToken", response.token, { expires: 7 });
          if (response.refreshToken) {
            Cookies.set("refreshToken", response.refreshToken, { expires: 30 });
          }

          // Update Redux state
          dispatch(
            setAuth({
              user: response.user,
              token: response.token,
              refreshToken: response.refreshToken,
            })
          );

          setToast({ type: "success", message: "Welcome back! 🎉" });

          // Navigate after a short delay to ensure state is updated
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
        }
      },
      onError: (error) => {
        const message = typeof error === "string" ? error : "Login failed";
        setToast({ type: "error", message });
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-medium text-white mb-3">Welcome Back</h1>
        <p className="text-white/70">Sign in and continue your adventure</p>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={toast.type === "error" ? undefined : 3000}
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <Input
          label=""
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          disabled={isPending}
          icon={<Mail size={20} />}
        />

        {/* Password */}
        <Input
          label=""
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          disabled={isPending}
          icon={<Lock size={20} />}
        />

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-white/70 cursor-pointer hover:text-white transition">
            <input type="checkbox" className="rounded" />
            <span>Remember me</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-blue-300 hover:text-blue-200 transition"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={isPending}
          className="w-full group"
        >
          {isPending ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition"
              />
            </>
          )}
        </Button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-white/70">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-300 font-semibold hover:text-blue-200 transition"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}
