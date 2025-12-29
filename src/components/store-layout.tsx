"use client";

import { useAppSelector } from "@/hooks/hooks";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Suspense } from "react";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export function StoreLayout({ children }: StoreLayoutProps) {
  const { storeNotFound, isInitialized } = useAppSelector(
    (state) => state.tenant
  );

  if (!isInitialized) {
    return null;
  }

  if (storeNotFound) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground text-lg">Loading...</p>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
      <Footer />
    </div>
  );
}
