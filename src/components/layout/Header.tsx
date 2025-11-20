// src/components/layout/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { Menu, X, LogOut } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useAuthToken } from "@/hooks/useAuthToken";
import { logout } from "@/redux/thunks/authThunks";
import type { RootState } from "@/redux/store";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Get auth state from Redux
  const { isAuthenticated: reduxIsAuth, token: reduxToken } = useAppSelector(
    (state: RootState) => state.auth
  );

  // Get auth state from cookies as fallback
  const { token: cookieToken, isLoading: cookieLoading } = useAuthToken();

  // Handle client-side hydration
  useEffect(() => {
    // Small delay to ensure Redux has rehydrated from localStorage
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Use Redux auth state, but show false during hydration to prevent flash
  // Fallback to cookie token if Redux token not available yet
  const isAuthenticated = isHydrated && (reduxIsAuth || !!reduxToken || !!cookieToken);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    closeMenu();
    try {
      await dispatch(logout()).unwrap();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <Container>
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="md" onClick={closeMenu} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/itineraries"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  My Trips
                </Link>
                <Link
                  href="/itineraries/create"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Trip
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t">
            <div className="flex flex-col space-y-3 pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-2"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/itineraries"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-2"
                  >
                    My Trips
                  </Link>
                  <Link
                    href="/itineraries/create"
                    onClick={closeMenu}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                  >
                    Create Trip
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors w-full"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};
