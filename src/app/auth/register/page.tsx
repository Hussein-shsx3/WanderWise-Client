"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/buttons/Button";
import { Input } from "@/components/ui/forms/Input";
import { Toast } from "@/components/ui/feedback/Toast";
import { useRegister } from "@/hooks/useAuthQuery";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/slices/authSlice";
import { ArrowRight, User, Mail, Lock, CheckCircle } from "lucide-react";
import Cookies from "js-cookie";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutate: register, isPending } = useRegister();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Valid email is required";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    register(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: (response) => {
          if (response.success && response.user && response.token) {
            // Store token in cookie
            Cookies.set("authToken", response.token, { expires: 7 });
            if (response.refreshToken) {
              Cookies.set("refreshToken", response.refreshToken, {
                expires: 30,
              });
            }

            // Update Redux state
            dispatch(
              setAuth({
                user: response.user,
                token: response.token,
                refreshToken: response.refreshToken,
              })
            );

            setToast({ type: "success", message: "Welcome to WanderWise! 🎉" });

            // Navigate after a short delay
            setTimeout(() => {
              router.push("/dashboard");
            }, 500);
          }
        },
        onError: (error) => {
          const message =
            typeof error === "string" ? error : "Registration failed";
          setToast({ type: "error", message });
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-medium text-white mb-3">
          Create Your Account
        </h1>
        <p className="text-white/70">
          Start your amazing journey with WanderWise
        </p>
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute left-4 top-4 text-white/50">
              <User size={20} />
            </div>
            <Input
              label=""
              name="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
              disabled={isPending}
              className="pl-12"
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-4 text-white/50">
              <User size={20} />
            </div>
            <Input
              label=""
              name="lastName"
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
              disabled={isPending}
              className="pl-12"
            />
          </div>
        </div>

        {/* Email */}
        <div className="relative">
          <div className="absolute left-4 top-4 text-white/50">
            <Mail size={20} />
          </div>
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
            className="pl-12"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <div className="absolute left-4 top-4 text-white/50">
            <Lock size={20} />
          </div>
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
            className="pl-12"
          />
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <div className="absolute left-4 top-4 text-white/50">
            <CheckCircle size={20} />
          </div>
          <Input
            label=""
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            disabled={isPending}
            className="pl-12"
          />
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 text-white/70 cursor-pointer hover:text-white transition">
          <input type="checkbox" className="rounded mt-1" required />
          <span className="text-sm">
            I agree to the{" "}
            <Link href="#" className="text-blue-300 hover:text-blue-200">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-blue-300 hover:text-blue-200">
              Privacy Policy
            </Link>
          </span>
        </label>

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
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition"
              />
            </>
          )}
        </Button>
      </form>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-white/70">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-300 font-semibold hover:text-blue-200 transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
