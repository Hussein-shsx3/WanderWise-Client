"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isAuthenticated = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40 shadow-sm">
      <Container maxWidth="xl" className="py-4 flex items-center justify-between">
        {/* Logo */}
        <Logo size="md" onClick={() => setMobileMenuOpen(false)} />

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center ml-auto">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-slate-700 hover:text-blue-600 font-medium transition">
                Dashboard
              </Link>
              <Link href="/itineraries" className="text-slate-700 hover:text-blue-600 font-medium transition">
                My Trips
              </Link>
              <button className="gradient-bg text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-slate-700 hover:text-blue-600 font-medium transition">
                Login
              </Link>
              <Link href="/auth/register" className="gradient-bg text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition">
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-blue-100 bg-white/95 backdrop-blur-md">
          <Container maxWidth="xl" className="py-4 flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-slate-700 hover:text-blue-600 font-medium py-2">
                  Dashboard
                </Link>
                <Link href="/itineraries" className="text-slate-700 hover:text-blue-600 font-medium py-2">
                  My Trips
                </Link>
                <button className="gradient-bg text-white px-4 py-2 rounded-lg font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-slate-700 hover:text-blue-600 font-medium py-2">
                  Login
                </Link>
                <Link href="/auth/register" className="gradient-bg text-white px-6 py-2 rounded-lg font-medium text-center">
                  Get Started
                </Link>
              </>
            )}
          </Container>
        </div>
      )}
    </header>
  );
};
