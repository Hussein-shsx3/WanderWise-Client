"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAppSelector } from "@/redux/hooks";
import type { RootState } from "@/redux/store";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header isAuthenticated={isClient && isAuthenticated} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
