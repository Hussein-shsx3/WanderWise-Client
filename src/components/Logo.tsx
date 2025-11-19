"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = "md", onClick }) => {
  const sizeMap = {
    sm: { icon: 20, text: "text-base", container: "p-1.5" },
    md: { icon: 28, text: "text-xl", container: "p-2" },
    lg: { icon: 40, text: "text-3xl", container: "p-3" },
  };

  const { icon, text, container } = sizeMap[size];

  return (
    <Link href="/" onClick={onClick}>
      <div className={`flex items-center gap-3 cursor-pointer ${className}`}>
        {/* Icon with enhanced gradient glow */}
        <div className="relative">
          {/* Icon background */}
          <div className={`relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl ${container} flex items-center justify-center shadow-lg`}>
            <Sparkles 
              size={icon} 
              className="text-white drop-shadow-lg"
              strokeWidth={2.5}
              fill="white"
            />
          </div>
        </div>

        {/* Text with enhanced styling */}
        <div className="flex flex-col leading-tight">
          <span className={`${text} font-medium gradient-text`}>
            WanderWise
          </span>
          <span className="text-xs font-medium tracking-widest text-gradient-text-to-r from-blue-500 to-purple-500 opacity-90">
            AI EXPLORER
          </span>
        </div>
      </div>
    </Link>
  );
};
