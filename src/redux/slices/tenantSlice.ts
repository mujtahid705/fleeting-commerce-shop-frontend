import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Theme, getThemeByIndex, getDefaultTheme } from "@/lib/themes";

// Category and SubCategory types
export interface SubCategory {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

// Brand information
export interface BrandInfo {
  logoUrl: string | null;
  tagline: string | null;
  description: string | null;
  theme: number;
}

// Tenant information from backend
export interface TenantInfo {
  id: string;
  name: string;
  domain: string;
  address: string | null;
  brand: BrandInfo;
  categories: Category[];
}

export interface TenantState {
  tenant: TenantInfo | null;
  theme: Theme;
  isDarkMode: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  storeNotFound: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenant: null,
  theme: getDefaultTheme(),
  isDarkMode: false,
  isLoading: true,
  isInitialized: false,
  storeNotFound: false,
  error: null,
};

// Extract subdomain from hostname
export function extractDomain(): string {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  return parts[0];
}

// Check if subdomain exists
export function hasSubdomain(): boolean {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname;

  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    return parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "www";
  }

  const parts = hostname.split(".");
  return parts.length >= 3 && parts[0] !== "www";
}

// Initialize tenant from URL
export const initializeTenant = createAsyncThunk<
  { tenant: TenantInfo; theme: Theme },
  void,
  { rejectValue: string }
>("tenant/initialize", async (_, { rejectWithValue }) => {
  const domain = extractDomain();
  console.log("[Tenant] Domain extracted:", domain);
  console.log("[Tenant] Has subdomain:", hasSubdomain());

  if (!hasSubdomain()) {
    console.log("[Tenant] No subdomain detected, rejecting");
    return rejectWithValue("NO_SUBDOMAIN");
  }

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api";
    const fullUrl = `${apiUrl}/tenants/storefront?domain=${encodeURIComponent(
      domain
    )}`;
    console.log("[Tenant] Fetching from:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    console.log("[Tenant] Response status:", response.status);

    if (!response.ok) {
      if (response.status === 404) {
        console.log("[Tenant] Store not found (404)");
        return rejectWithValue("STORE_NOT_FOUND");
      }
      console.log("[Tenant] Fetch error, status:", response.status);
      return rejectWithValue("FETCH_ERROR");
    }

    const result = await response.json();
    console.log("[Tenant] API Response:", result);
    const tenantData = result.data as TenantInfo;
    const theme = getThemeByIndex(tenantData.brand.theme);
    console.log(
      "[Tenant] Tenant loaded:",
      tenantData.name,
      "Theme:",
      theme.name
    );

    return { tenant: tenantData, theme };
  } catch (error) {
    console.error("Failed to fetch tenant:", error);
    return rejectWithValue("FETCH_ERROR");
  }
});

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenant: (state, action: PayloadAction<TenantInfo>) => {
      state.tenant = action.payload;
      state.theme = getThemeByIndex(action.payload.brand.theme);
      state.storeNotFound = false;
    },
    setThemeByIndex: (state, action: PayloadAction<number>) => {
      state.theme = getThemeByIndex(action.payload);
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setStoreNotFound: (state, action: PayloadAction<boolean>) => {
      state.storeNotFound = action.payload;
    },
    resetTenant: (state) => {
      state.tenant = null;
      state.theme = getDefaultTheme();
      state.isDarkMode = false;
      state.error = null;
      state.storeNotFound = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeTenant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.storeNotFound = false;
      })
      .addCase(initializeTenant.fulfilled, (state, action) => {
        state.tenant = action.payload.tenant;
        state.theme = action.payload.theme;
        state.isLoading = false;
        state.isInitialized = true;
        state.storeNotFound = false;
        state.error = null;
      })
      .addCase(initializeTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;

        if (
          action.payload === "NO_SUBDOMAIN" ||
          action.payload === "STORE_NOT_FOUND"
        ) {
          state.storeNotFound = true;
        }
        state.error = action.payload || "Failed to initialize tenant";
      });
  },
});

export const {
  setTenant,
  setThemeByIndex,
  setTheme,
  toggleDarkMode,
  setDarkMode,
  setLoading,
  setStoreNotFound,
  resetTenant,
} = tenantSlice.actions;

export default tenantSlice.reducer;
