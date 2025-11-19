"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "gradient-bg text-white hover:shadow-lg hover:shadow-blue-500/50 focus-visible:ring-blue-500 transform hover:scale-105",
  secondary: "bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:shadow-lg focus-visible:ring-slate-500 transform hover:scale-105",
  danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:shadow-red-500/50 focus-visible:ring-red-500 transform hover:scale-105",
  outline: "border-2 border-blue-500 bg-white/10 text-white hover:bg-white/20 focus-visible:ring-blue-500 backdrop-blur",
  ghost: "text-white hover:bg-white/10 focus-visible:ring-white/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className = "",
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    ...props
  }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:scale-100";
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
      <button
        className={combinedClassName}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
