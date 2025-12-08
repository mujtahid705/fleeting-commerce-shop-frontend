"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export default function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);
    let timeoutId: NodeJS.Timeout;
    const startLoading = () => {
      setLoading(true);
      timeoutId = setTimeout(() => setLoading(false), 2000);
    };
    const stopLoading = () => {
      setLoading(false);
      if (timeoutId) clearTimeout(timeoutId);
    };
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    window.history.pushState = function (...args) {
      startLoading();
      originalPushState.apply(window.history, args);
      setTimeout(stopLoading, 100);
    };
    window.history.replaceState = function (...args) {
      startLoading();
      originalReplaceState.apply(window.history, args);
      setTimeout(stopLoading, 100);
    };
    window.addEventListener("popstate", stopLoading);
    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", stopLoading);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  useEffect(() => {
    setLoading(false);
  }, [pathname]);
  if (!loading) return null;
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-[10000]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}
