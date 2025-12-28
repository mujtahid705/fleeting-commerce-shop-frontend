"use client";

import { useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { initializeTenant, setDarkMode } from "@/redux/slices/tenantSlice";
import { applyTheme } from "@/lib/themes";
import StoreNotFound from "@/components/store-not-found";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useAppDispatch();
  const { theme, isDarkMode, isInitialized, isLoading, tenant, storeNotFound } =
    useAppSelector((state) => state.tenant);

  // Initialize tenant on mount
  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeTenant());
    }
  }, [dispatch, isInitialized]);

  // Dark mode preference
  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized && !storeNotFound) {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) {
        dispatch(setDarkMode(saved === "true"));
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        dispatch(setDarkMode(prefersDark));
      }
    }
  }, [dispatch, isInitialized, storeNotFound]);

  // Apply theme
  useEffect(() => {
    if (theme && !storeNotFound) {
      applyTheme(theme, isDarkMode);
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", String(isDarkMode));
      }
    }
  }, [theme, isDarkMode, storeNotFound]);

  // Update document title and favicon
  useEffect(() => {
    if (tenant && typeof document !== "undefined") {
      const title = tenant.brand.tagline
        ? `${tenant.name} - ${tenant.brand.tagline}`
        : tenant.name;
      document.title = title;

      if (tenant.brand.logoUrl) {
        const link: HTMLLinkElement =
          document.querySelector("link[rel*='icon']") ||
          document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = tenant.brand.logoUrl;
        document.head.appendChild(link);
      }
    }
  }, [tenant]);

  // System theme change listener
  useEffect(() => {
    if (typeof window === "undefined" || storeNotFound) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("darkMode");
      if (saved === null) {
        dispatch(setDarkMode(e.matches));
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [dispatch, storeNotFound]);

  // Loading state
  if (isLoading && !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mb-4"></div>
          <p className="text-slate-600 text-lg">Loading store...</p>
        </div>
      </div>
    );
  }

  // Store not found
  if (storeNotFound) {
    return <StoreNotFound />;
  }

  return <>{children}</>;
}

// Hook to access theme
export function useTheme() {
  const { theme, isDarkMode, isLoading, tenant, storeNotFound } =
    useAppSelector((state) => state.tenant);
  const dispatch = useAppDispatch();

  const toggleDarkMode = useCallback(() => {
    dispatch(setDarkMode(!isDarkMode));
  }, [dispatch, isDarkMode]);

  const setDarkModeValue = useCallback(
    (value: boolean) => {
      dispatch(setDarkMode(value));
    },
    [dispatch]
  );

  return {
    theme,
    isDarkMode,
    isLoading,
    tenant,
    storeNotFound,
    toggleDarkMode,
    setDarkMode: setDarkModeValue,
    themeName: theme?.name || "Default",
    themeId: theme?.id || 1,
    storeName: tenant?.name || "",
    storeLogo: tenant?.brand?.logoUrl || null,
    storeTagline: tenant?.brand?.tagline || null,
    storeDescription: tenant?.brand?.description || null,
    categories: tenant?.categories || [],
  };
}

export default ThemeProvider;
