import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Types
export type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  brand: string;
  images: { url?: string; imageUrl?: string; [key: string]: any }[];
  description?: string;
  categoryId?: string | number;
  subCategoryId?: string | number;
  inventory?: { quantity: number };
  category?: { id: number; name: string; slug: string };
  subCategory?: { id: number; name: string; slug: string };
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type SubCategory = {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
};

// State interface
interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  currentItem: Product | null;
  currentLoading: boolean;
  currentError: string | null;
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  subcategories: SubCategory[];
  subcategoriesLoading: boolean;
  subcategoriesError: string | null;
  lastFetched: {
    products: number | null;
    categories: number | null;
    subcategories: number | null;
  };
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  currentItem: null,
  currentLoading: false,
  currentError: null,
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  subcategories: [],
  subcategoriesLoading: false,
  subcategoriesError: null,
  lastFetched: {
    products: null,
    categories: null,
    subcategories: null,
  },
};

// API Calls
const getTenantDomain = () => {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  return parts[0];
};

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async (filters?: {
    category?: string | number;
    subCategory?: string | number;
  }) => {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const imageBase = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
    const params = new URLSearchParams();
    if (filters?.category !== undefined && filters?.category !== "") {
      params.set("categoryId", String(filters.category));
    }
    if (filters?.subCategory !== undefined && filters?.subCategory !== "") {
      params.set("subCategoryId", String(filters.subCategory));
    }
    const qs = params.toString();
    const url = `${base}/storefront/products${qs ? `?${qs}` : ""}`;
    console.log("🔍 Fetching products from:", url);
    const res = await fetch(url, {
      cache: "no-cache",
      headers: {
        "x-tenant-domain": getTenantDomain(),
      },
    });
    if (!res.ok) {
      console.error("❌ Products API failed:", res.status, res.statusText);
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    const json = await res.json();
    console.log("📦 Raw API Response:", json);
    const list = (json?.data ?? json ?? []) as Array<{
      id: string;
      title: string;
      slug: string;
      price: number;
      stock: number;
      brand: string;
      categoryId?: string | number;
      category?: { id: string | number; name: string; slug: string };
      subCategoryId?: string | number;
      subCategory?: { id: string | number; name: string; slug: string };
      inventory?: { quantity: number };
      images?: Array<
        | {
            url?: string;
            imageUrl?: string;
            path?: string;
            src?: string;
          }
        | string
      >;
    }>;
    console.log("📋 Products list:", list);
    console.log("📊 Products count:", list.length);
    const isAbsolute = (u: string) => /^https?:\/\//i.test(u);
    const joinUrl = (root: string, path?: string) => {
      if (!path) return "/vercel.svg";
      if (isAbsolute(path)) return path;
      if (!root) return path;
      const r = root.endsWith("/") ? root.slice(0, -1) : root;
      const p = path.startsWith("/") ? path : `/${path}`;
      return `${r}${p}`;
    };
    const mappedProducts = list.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      stock: p?.inventory?.quantity ?? p.stock ?? 0,
      brand: p.brand,
      categoryId: p?.categoryId ?? p?.category?.id ?? p?.category ?? undefined,
      subCategoryId:
        p?.subCategoryId ?? p?.subCategory?.id ?? p?.subCategory ?? undefined,
      inventory: p?.inventory,
      category: p?.category,
      subCategory: p?.subCategory,
      images: Array.isArray(p.images)
        ? p.images.map((im: unknown) => {
            const raw =
              typeof im === "string"
                ? im
                : typeof im === "object" && im !== null
                ? (
                    im as {
                      url?: string;
                      imageUrl?: string;
                      path?: string;
                      src?: string;
                    }
                  )?.url ??
                  (
                    im as {
                      url?: string;
                      imageUrl?: string;
                      path?: string;
                      src?: string;
                    }
                  )?.imageUrl ??
                  (
                    im as {
                      url?: string;
                      imageUrl?: string;
                      path?: string;
                      src?: string;
                    }
                  )?.path ??
                  (
                    im as {
                      url?: string;
                      imageUrl?: string;
                      path?: string;
                      src?: string;
                    }
                  )?.src
                : undefined;
            return { url: joinUrl(imageBase, raw) };
          })
        : [],
    })) as Product[];
    console.log("✅ Mapped products:", mappedProducts);
    return mappedProducts;
  }
);
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string | number) => {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const imageBase = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
    const res = await fetch(`${base}/storefront/products/${id}`, {
      cache: "force-cache",
      next: { revalidate: 30 },
      headers: {
        "x-tenant-domain": getTenantDomain(),
      },
    } as any);
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || `Failed to fetch product ${id}`);
    }
    const json = await res.json();
    const d = json?.data ?? {};
    const isAbsolute = (u: string) => /^https?:\/\//i.test(u);
    const joinUrl = (root: string, path?: string) => {
      if (!path) return "/vercel.svg";
      if (isAbsolute(path)) return path;
      if (!root) return path;
      const r = root.endsWith("/") ? root.slice(0, -1) : root;
      const p = String(path).startsWith("/") ? String(path) : `/${path}`;
      return `${r}${p}`;
    };
    const images: { url: string }[] = Array.isArray(d?.images)
      ? d.images.map((im: any) => {
          const raw =
            typeof im === "string"
              ? im
              : im?.imageUrl ?? im?.url ?? im?.path ?? im?.src;
          return { url: joinUrl(imageBase, raw) };
        })
      : [];
    const product: Product = {
      id: String(d?.id ?? id),
      title: d?.title ?? "Untitled",
      slug: d?.slug ?? String(d?.id ?? id),
      price: Number(d?.price) || 0,
      stock: Number(d?.inventory?.quantity ?? d?.stock) || 0,
      brand: d?.brand ?? "",
      description: d?.description ?? "",
      categoryId: d?.categoryId ?? d?.category?.id ?? d?.category ?? undefined,
      subCategoryId:
        d?.subCategoryId ?? d?.subCategory?.id ?? d?.subCategory ?? undefined,
      images,
      inventory: d?.inventory,
      category: d?.category,
      subCategory: d?.subCategory,
    };
    return product;
  }
);
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const res = await fetch(`${base}/storefront/categories`, {
      cache: "no-cache",
      headers: {
        "x-tenant-domain": getTenantDomain(),
      },
    });
    if (!res.ok) throw new Error("Failed to load categories");
    const json = await res.json();
    const data: any[] = json?.data ?? json ?? [];
    return data.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })) as Category[];
  }
);
export const fetchSubcategories = createAsyncThunk(
  "products/fetchSubcategories",
  async (categoryId: string | number) => {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const res = await fetch(
      `${base}/storefront/subcategories?categoryId=${encodeURIComponent(
        String(categoryId)
      )}`,
      {
        cache: "no-cache",
        headers: {
          "x-tenant-domain": getTenantDomain(),
        },
      }
    );
    if (!res.ok) throw new Error("Failed to load subcategories");
    const json = await res.json();
    const data: any[] = json?.data ?? json ?? [];
    return data.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      categoryId: s.categoryId,
    })) as SubCategory[];
  }
);
export const fetchAllSubcategories = createAsyncThunk(
  "products/fetchAllSubcategories",
  async () => {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const res = await fetch(`${base}/storefront/subcategories`, {
      cache: "no-cache",
      headers: {
        "x-tenant-domain": getTenantDomain(),
      },
    });
    if (!res.ok) throw new Error("Failed to load subcategories");
    const json = await res.json();
    const data: any[] = json?.data ?? json ?? [];
    return data.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      categoryId: s.categoryId,
      category: s.category
        ? {
            id: s.category.id,
            name: s.category.name,
            slug: s.category.slug,
          }
        : undefined,
    })) as SubCategory[];
  }
);

// Slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastFetched.products = Date.now();
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load products";
      })
      .addCase(fetchProductById.pending, (state) => {
        state.currentLoading = true;
        state.currentError = null;
        state.currentItem = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentLoading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentLoading = false;
        state.currentError = action.error.message || "Failed to load product";
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
        state.lastFetched.categories = Date.now();
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError =
          action.error.message || "Failed to load categories";
      })
      .addCase(fetchSubcategories.pending, (state) => {
        state.subcategoriesLoading = true;
        state.subcategoriesError = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategoriesLoading = false;
        state.subcategories = action.payload;
        state.lastFetched.subcategories = Date.now();
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.subcategoriesLoading = false;
        state.subcategoriesError =
          action.error.message || "Failed to load subcategories";
      })
      .addCase(fetchAllSubcategories.pending, (state) => {
        state.subcategoriesLoading = true;
        state.subcategoriesError = null;
      })
      .addCase(fetchAllSubcategories.fulfilled, (state, action) => {
        state.subcategoriesLoading = false;
        state.subcategories = action.payload;
        state.lastFetched.subcategories = Date.now();
      })
      .addCase(fetchAllSubcategories.rejected, (state, action) => {
        state.subcategoriesLoading = false;
        state.subcategoriesError =
          action.error.message || "Failed to load subcategories";
      });
  },
});

export default productsSlice.reducer;
