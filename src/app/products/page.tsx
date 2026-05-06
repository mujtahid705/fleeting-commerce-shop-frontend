"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/products/product-card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  fetchAllProducts,
  fetchCategories,
  fetchAllSubcategories,
} from "@/redux/slices/productsSlice";
import {
  getOriginalPrice,
  getSaleDiscountAmount,
  getSaleDiscountPercentage,
  getSalePrice,
} from "@/lib/discount-pricing";

type CardProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  saleTitle?: string;
  discountPercentage?: number;
  saleDiscountAmount?: number;
};

function parseFilterId(value: string | null): number | "" {
  if (!value) return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : "";
}

function ProductsFallback() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-12 h-24 max-w-3xl animate-pulse rounded bg-muted" />
        <div className="mb-8 h-24 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-lg bg-card">
              <div className="aspect-square animate-pulse bg-muted" />
              <div className="space-y-2 p-4">
                <div className="h-4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    items,
    loading,
    error,
    categories,
    subcategories,
  } = useSelector((s: RootState) => s.products);
  const { theme, tenant } = useSelector((s: RootState) => s.tenant);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | ""
  >("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isClient, setIsClient] = useState(false);
  const lastFocusRefreshAt = useRef(0);

  const categoryParam = searchParams.get("category");
  const subCategoryParam = searchParams.get("subCategory");
  const searchParam = searchParams.get("search");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const categoryId = parseFilterId(categoryParam);
    const subCategoryId = categoryId ? parseFilterId(subCategoryParam) : "";

    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(subCategoryId);
  }, [categoryParam, subCategoryParam]);

  useEffect(() => {
    setSearchQuery(searchParam || "");
  }, [searchParam]);

  const updateFilterUrl = (
    categoryId: number | "",
    subCategoryId: number | ""
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId) {
      params.set("category", String(categoryId));
    } else {
      params.delete("category");
    }

    if (categoryId && subCategoryId) {
      params.set("subCategory", String(subCategoryId));
    } else {
      params.delete("subCategory");
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  };

  const updateSearchUrl = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      params.set("search", trimmedQuery);
    } else {
      params.delete("search");
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateSearchUrl(value);
  };

  const handleCategoryChange = (value: string) => {
    const categoryId = value ? Number(value) : "";
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId("");
    updateFilterUrl(categoryId, "");
  };

  const handleSubCategoryChange = (value: string) => {
    const subCategoryId = value ? Number(value) : "";
    setSelectedSubCategoryId(subCategoryId);
    updateFilterUrl(selectedCategoryId, subCategoryId);
  };

  const clearFilters = () => {
    setSelectedCategoryId("");
    setSelectedSubCategoryId("");
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("subCategory");
    params.delete("search");

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  };

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    return subcategories.filter((sub) => sub.categoryId === selectedCategoryId);
  }, [subcategories, selectedCategoryId]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );
  const selectedSubCategory = useMemo(
    () =>
      subcategories.find(
        (subcategory) => subcategory.id === selectedSubCategoryId
      ),
    [subcategories, selectedSubCategoryId]
  );

  const fetchCurrentProducts = useCallback(() => {
    const payload: { category?: number; subCategory?: number } = {};
    if (selectedCategoryId) payload.category = selectedCategoryId;
    if (selectedCategoryId && selectedSubCategoryId) {
      payload.subCategory = selectedSubCategoryId;
    }

    dispatch(fetchAllProducts(payload));
  }, [dispatch, selectedCategoryId, selectedSubCategoryId]);

  useEffect(() => {
    if (!isClient) return;
    dispatch(fetchCategories());
    dispatch(fetchAllSubcategories());
  }, [dispatch, isClient]);

  useEffect(() => {
    if (!isClient) return;
    fetchCurrentProducts();
  }, [fetchCurrentProducts, isClient]);

  useEffect(() => {
    if (!isClient) return;

    const refreshCurrentProductsOnce = () => {
      const now = Date.now();
      if (now - lastFocusRefreshAt.current < 500) return;
      lastFocusRefreshAt.current = now;
      fetchCurrentProducts();
    };

    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") {
        refreshCurrentProductsOnce();
      }
    };

    window.addEventListener("focus", refreshCurrentProductsOnce);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      window.removeEventListener("focus", refreshCurrentProductsOnce);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [fetchCurrentProducts, isClient]);

  const allProducts: CardProduct[] = useMemo(
    () =>
      items.map((p) => {
        const imageUrl =
          p.images?.[0]?.imageUrl || p.images?.[0]?.url || "/vercel.svg";
        return {
          id: String(p.id),
          name: p.title ?? "Untitled",
          price: getSalePrice(p),
          originalPrice: getOriginalPrice(p),
          rating: Number(p.averageRating) || 0,
          reviews: Number(p.reviewCount) || 0,
          image: imageUrl,
          category: p.category?.name || p.brand || "all",
          saleTitle: p.pricing?.activeSaleDiscount?.title,
          discountPercentage: getSaleDiscountPercentage(p),
          saleDiscountAmount: getSaleDiscountAmount(p),
        };
      }),
    [items]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allProducts;
    return allProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [allProducts, searchQuery]);

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    switch (sortBy) {
      case "price-low":
        return arr.sort((a, b) => a.price - b.price);
      case "price-high":
        return arr.sort((a, b) => b.price - a.price);
      case "name":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return arr;
    }
  }, [filteredProducts, sortBy]);

  const pageVariant = theme.layout.homeVariant;
  const isEditorial = pageVariant === "editorial";
  const isModern = pageVariant === "modern";
  const isLuxury = pageVariant === "luxury";
  const storeName = tenant?.name || "Store";
  const hasActiveFilters =
    Boolean(selectedCategoryId) ||
    Boolean(selectedSubCategoryId) ||
    Boolean(searchQuery.trim());

  const titleClass =
    isEditorial || isLuxury
      ? "text-5xl font-semibold uppercase leading-none tracking-[0.06em] text-foreground sm:text-6xl"
      : isModern
      ? "text-5xl font-semibold leading-tight text-foreground sm:text-6xl"
      : "text-4xl font-light text-foreground mb-4";
  const controlsShellClass =
    isEditorial || isModern || isLuxury
      ? "border-y border-border bg-card px-4 py-5"
      : "rounded-lg border border-border bg-card p-4 shadow-sm";
  const inputShellClass =
    isEditorial || isLuxury
      ? "flex min-w-0 flex-1 items-center gap-2 border-b border-foreground/40 bg-transparent px-0 py-2"
      : isModern
      ? "flex min-w-0 flex-1 items-center gap-2 border border-border bg-background px-4 py-2"
      : "flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-background px-4 py-2";
  const selectClass =
    isEditorial || isLuxury
      ? "min-h-10 border border-border bg-background px-3 py-2 text-xs uppercase tracking-[0.18em] focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      : isModern
      ? "min-h-10 border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      : "min-h-10 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {!isClient ? (
          <div
            className={
              isEditorial || isLuxury || isModern
                ? "mb-12 max-w-3xl"
                : "mb-12 text-center"
            }
          >
            <h1 className={titleClass}>
              Our <span className="font-semibold">Products</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg font-light text-muted-foreground">
              Browse products available from this store.
            </p>
          </div>
        ) : (
          <motion.div
            className={
              isEditorial || isLuxury || isModern
                ? "mb-14 max-w-3xl"
                : "mb-12 text-center"
            }
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className={
                isEditorial
                  ? "mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-accent"
                  : isLuxury
                  ? "mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-primary"
                  : isModern
                  ? "mb-4 text-sm font-semibold text-primary"
                  : "hidden"
              }
            >
              {storeName}
            </p>
            <h1 className={titleClass}>
              Our <span className="font-semibold">Products</span>
            </h1>
            <p
              className={
                isEditorial
                  ? "mt-6 max-w-xl text-base leading-7 text-muted-foreground"
                  : isLuxury || isModern
                  ? "mt-6 max-w-xl text-base leading-7 text-muted-foreground"
                  : "mx-auto max-w-2xl text-lg font-light text-muted-foreground"
              }
            >
              Browse products available from this store.
            </p>
          </motion.div>
        )}

        {!isClient ? (
          <div className="mb-8 rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="h-10 flex-1 rounded bg-muted animate-pulse" />
              <div className="h-10 w-full rounded bg-muted animate-pulse lg:w-80" />
            </div>
          </div>
        ) : (
          <motion.div
            className={controlsShellClass}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className={inputShellClass}>
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <select
                    value={
                      selectedCategoryId === ""
                        ? ""
                        : String(selectedCategoryId)
                    }
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={
                      selectedSubCategoryId === ""
                        ? ""
                        : String(selectedSubCategoryId)
                    }
                    onChange={(e) => handleSubCategoryChange(e.target.value)}
                    className={selectClass}
                    disabled={!selectedCategoryId}
                  >
                    <option value="">All Subcategories</option>
                    {filteredSubcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={selectClass}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>

                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  {selectedCategory ? (
                    <span className="rounded-full bg-secondary px-3 py-1">
                      Category: {selectedCategory.name}
                    </span>
                  ) : (
                    <span className="rounded-full bg-secondary px-3 py-1">
                      All categories
                    </span>
                  )}
                  {selectedSubCategory && (
                    <span className="rounded-full bg-secondary px-3 py-1">
                      Subcategory: {selectedSubCategory.name}
                    </span>
                  )}
                  {searchQuery.trim() && (
                    <span className="rounded-full bg-secondary px-3 py-1">
                      Search: {searchQuery.trim()}
                    </span>
                  )}
                </div>
                <p>
                  {loading
                    ? "Loading products..."
                    : error
                    ? `Error: ${error}`
                    : `Showing ${sortedProducts.length} of ${allProducts.length} products`}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-8">
          {!isClient || loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg bg-card shadow-lg"
                >
                  <div className="aspect-square animate-pulse bg-muted" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/30 bg-card p-8 text-center text-destructive">
              {error}
            </div>
          ) : sortedProducts.length > 0 ? (
            <motion.div
              className={
                isEditorial || isLuxury || isModern
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                  : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {sortedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="py-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                No products found
              </h3>
              <p className="mb-4 text-muted-foreground">
                Try adjusting your search or filters.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
