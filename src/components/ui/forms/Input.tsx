"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = "", ...props }, ref) => {
    const inputClasses = `
      w-full px-4 py-3 ${icon ? "pl-12" : ""} text-sm border-2 rounded-xl
      text-gray-900 placeholder-gray-400
      bg-white hover:bg-gray-50
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      transition-all duration-300
      ${error ? "border-red-500" : "border-gray-300 hover:border-gray-400"}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 flex items-center">
              {icon}
            </div>
          )}
          <input ref={ref} className={inputClasses} {...props} />
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-600">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };