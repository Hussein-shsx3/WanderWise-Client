"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAppSelector } from "@/redux/hooks";
import type { RootState } from "@/redux/store";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div className="flex flex-col min-h-screen">
      <Header isAuthenticated={isAuthenticated} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
