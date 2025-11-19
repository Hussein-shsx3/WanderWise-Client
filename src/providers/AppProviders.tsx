"use client";

import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { store, persistor } from "@/redux/store";
import queryClient from "@/lib/react-query";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { useRouter } from "next/navigation";

interface AppProvidersProps {
  children: React.ReactNode;
}

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

export default function AppProviders({ children }: AppProvidersProps) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (router) {
      setIsRouterReady(true);
    }
  }, [router]);

  if (!isClient) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          {isRouterReady ? children : <LoadingScreen />}
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
