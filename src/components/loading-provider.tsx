"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 3000);
    };
    const handleComplete = () => {
      setLoading(false);
    };
    handleComplete();
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;
    window.history.pushState = function (state, title, url) {
      handleStart();
      const result = originalPush.call(this, state, title, url);
      setTimeout(handleComplete, 500);
      return result;
    };
    window.history.replaceState = function (state, title, url) {
      handleStart();
      const result = originalReplace.call(this, state, title, url);
      setTimeout(handleComplete, 500);
      return result;
    };
    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
    };
  }, [pathname, searchParams]);
  return (
    <>
      {children}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[10000]">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
}
