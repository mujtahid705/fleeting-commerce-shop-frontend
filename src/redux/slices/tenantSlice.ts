import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Theme, getThemeByIndex, getDefaultTheme } from "@/lib/themes";
import {
  createThemePreviewTenant,
  getThemePreviewIndexFromPath,
  isThemePreviewHostname,
} from "@/lib/theme-preview";

// SubCategory type
export interface SubCategory {
  id: number;
  name: string;
  slug: string;
}

// Category type
export interface Category {
  id: number;
  name: string;
  slug: string;
  subCategories?: SubCategory[];
}

// Customization types - matching API response structure
export interface HeroCustomization {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

// Browse categories item from API
export interface BrowseCategoryItem {
  categoryId: number;
  displayOrder: number;
  category: Category;
}

// Browse categories section from API
export interface BrowseCategoriesSection {
  title: string;
  categories: BrowseCategoryItem[];
}

// Exclusive product item from API
export interface ExclusiveProductItem {
  productId: string;
  customImage?: string;
  customTitle?: string;
  displayOrder: number;
}

// Exclusive section from API
export interface ExclusiveSectionCustomization {
  title: string;
  products: ExclusiveProductItem[];
}

// Featured categories item from API
export interface FeaturedCategoryItem {
  categoryId: number;
  displayOrder: number;
  category: Category;
}

// Featured categories section from API
export interface FeaturedCategoriesSection {
  title: string;
  categories: FeaturedCategoryItem[];
}

// Quick link for footer
export interface QuickLink {
  label: string;
  url: string;
}

// Social links for footer
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

// Footer customization from API
export interface FooterCustomization {
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: SocialLinks;
  copyrightText?: string;
  quickLinks?: QuickLink[];
}

export interface AboutPageHero {
  eyebrow?: string;
  title?: string;
  highlightText?: string;
  description?: string;
  backgroundImage?: string | null;
  backgroundImagePublicId?: string;
}

export interface AboutPageStatItem {
  label?: string;
  value?: string;
  icon?: string;
}

export interface AboutPageStory {
  isEnabled?: boolean;
  eyebrow?: string;
  title?: string;
  paragraphs?: string[];
  featuredCard?: {
    title?: string;
    description?: string;
    icon?: string;
  };
  image?: string | null;
  imagePublicId?: string;
}

export interface AboutPageValues {
  isEnabled?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: {
    title?: string;
    description?: string;
    icon?: string;
  }[];
}

export interface AboutPageMilestones {
  isEnabled?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: {
    year?: string;
    title?: string;
    description?: string;
  }[];
}

export interface AboutPageTeam {
  isEnabled?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  members?: {
    name?: string;
    role?: string;
    description?: string;
    image?: string | null;
    imagePublicId?: string;
  }[];
}

export interface AboutPageCustomization {
  isEnabled?: boolean;
  hero?: AboutPageHero;
  stats?: {
    isEnabled?: boolean;
    items?: AboutPageStatItem[];
  };
  story?: AboutPageStory;
  values?: AboutPageValues;
  milestones?: AboutPageMilestones;
  team?: AboutPageTeam;
  mission?: {
    isEnabled?: boolean;
    title?: string;
    description?: string;
    icon?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface ContactPageCustomization {
  isEnabled?: boolean;
  hero?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
  contactInfo?: {
    isEnabled?: boolean;
    items?: {
      type?: string;
      title?: string;
      description?: string;
      details?: string;
      actionUrl?: string | null;
      icon?: string;
    }[];
  };
  form?: {
    isEnabled?: boolean;
    title?: string;
    description?: string;
    submitButtonText?: string;
    successMessage?: string;
    recipientEmail?: string;
    fields?: Partial<
      Record<
        "name" | "email" | "subject" | "message",
        {
          isEnabled?: boolean;
          isRequired?: boolean;
          label?: string;
          placeholder?: string;
        }
      >
    >;
  };
  supportOptions?: {
    isEnabled?: boolean;
    title?: string;
    items?: {
      title?: string;
      description?: string;
      isAvailable?: boolean;
      actionUrl?: string | null;
      icon?: string;
    }[];
  };
  socialLinks?: {
    isEnabled?: boolean;
    title?: string;
    items?: {
      platform?: string;
      label?: string;
      url?: string;
    }[];
  };
  faq?: {
    isEnabled?: boolean;
    eyebrow?: string;
    title?: string;
    description?: string;
    items?: {
      question?: string;
      answer?: string;
    }[];
  };
  location?: {
    isEnabled?: boolean;
    title?: string;
    description?: string;
    addressLabel?: string;
    address?: string;
    mapEmbedUrl?: string | null;
    directionsUrl?: string | null;
    buttonText?: string;
    mapImage?: string | null;
    mapImagePublicId?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
}

// Brand information - sections are directly under brand, not nested in customization
export interface BrandInfo {
  logoUrl: string | null;
  tagline: string | null;
  description: string | null;
  theme: number;
  // Sections directly under brand (matching API structure)
  hero?: HeroCustomization;
  browseCategories?: BrowseCategoriesSection;
  exclusiveSection?: ExclusiveSectionCustomization;
  featuredCategories?: FeaturedCategoriesSection;
  footer?: FooterCustomization;
  aboutPage?: AboutPageCustomization;
  contactPage?: ContactPageCustomization;
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
  isThemePreview: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenant: null,
  theme: getDefaultTheme(),
  isDarkMode: false,
  isLoading: true,
  isInitialized: false,
  storeNotFound: false,
  isThemePreview: false,
  error: null,
};

// Extract subdomain from hostname
export function extractDomain(): string {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  return parts[0];
}

export function isThemePreviewDomain(): boolean {
  if (typeof window === "undefined") return false;
  return isThemePreviewHostname(window.location.hostname);
}

function withCacheBuster(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
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
  { tenant: TenantInfo; theme: Theme; isThemePreview?: boolean },
  void,
  { rejectValue: string }
>("tenant/initialize", async (_, { rejectWithValue }) => {
  const domain = extractDomain();
  console.log("[Tenant] Domain extracted:", domain);
  console.log("[Tenant] Has subdomain:", hasSubdomain());

  if (isThemePreviewDomain()) {
    const themeIndex = getThemePreviewIndexFromPath(window.location.pathname);
    const tenant = createThemePreviewTenant(themeIndex);
    const theme = getThemeByIndex(themeIndex);
    console.log("[Tenant] Theme preview loaded:", theme.name);
    return { tenant, theme, isThemePreview: true };
  }

  if (!hasSubdomain()) {
    console.log("[Tenant] No subdomain detected, rejecting");
    return rejectWithValue("NO_SUBDOMAIN");
  }

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api";
    const fullUrl = withCacheBuster(
      `${apiUrl}/tenants/storefront?domain=${encodeURIComponent(domain)}`
    );
    console.log("[Tenant] Fetching from:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
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
    try {
      const brandResponse = await fetch(
        withCacheBuster(
          `${apiUrl}/tenant-brand/domain?domain=${encodeURIComponent(domain)}`
        ),
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            Pragma: "no-cache",
          },
          credentials: "include",
        }
      );

      if (brandResponse.ok) {
        const brandResult = await brandResponse.json();
        tenantData.brand = {
          ...tenantData.brand,
          ...(brandResult.data as Partial<BrandInfo>),
        };
      }
    } catch (brandError) {
      console.warn("Failed to fetch tenant brand settings:", brandError);
    }

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

export const fetchTenantBrandSettings = createAsyncThunk<
  Partial<BrandInfo>,
  void,
  { rejectValue: string }
>("tenant/fetchBrandSettings", async (_, { rejectWithValue }) => {
  const domain = extractDomain();

  if (isThemePreviewDomain()) {
    return {};
  }

  if (!hasSubdomain()) {
    return rejectWithValue("NO_SUBDOMAIN");
  }

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api";
    const response = await fetch(
      withCacheBuster(
        `${apiUrl}/tenant-brand/domain?domain=${encodeURIComponent(domain)}`
      ),
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          Pragma: "no-cache",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      return rejectWithValue("FETCH_ERROR");
    }

    const result = await response.json();
    return (result.data as Partial<BrandInfo>) || {};
  } catch (error) {
    console.error("Failed to fetch tenant brand settings:", error);
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
      state.isThemePreview = false;
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
      state.isThemePreview = false;
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
        state.isThemePreview = Boolean(action.payload.isThemePreview);
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
        state.isThemePreview = false;
        state.error = action.payload || "Failed to initialize tenant";
      })
      .addCase(fetchTenantBrandSettings.fulfilled, (state, action) => {
        if (!state.tenant) {
          return;
        }

        state.tenant.brand = {
          ...state.tenant.brand,
          ...action.payload,
        };

        if (typeof action.payload.theme === "number") {
          state.theme = getThemeByIndex(action.payload.theme);
        }
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
