"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
export function TopLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }, 500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathname]);
  if (!loading) return null;
  return (
    <>
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-300 ease-out z-[10001]"
        style={{ width: `${progress}%` }}
      />
      {progress < 30 && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-[10000]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
}
