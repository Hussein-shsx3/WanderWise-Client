"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    const inputClasses = `
      w-full px-4 py-3 text-sm backdrop-blur-md bg-white/20 border-2 rounded-xl
      text-white placeholder-white/50
      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
      transition-all duration-300
      ${error ? "border-red-400/50" : "border-white/30 hover:border-white/50"}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-white/90 mb-2">
            {label}
            {props.required && <span className="text-red-300 ml-1">*</span>}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-sm text-white/60">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
