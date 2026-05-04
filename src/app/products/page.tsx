"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/products/product-card";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  fetchAllProducts,
  fetchCategories,
  fetchAllSubcategories,
} from "@/redux/slices/productsSlice";
type CardProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
};
export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items,
    loading,
    error,
    categories,
    subcategories,
    categoriesLoading,
    subcategoriesLoading,
    lastFetched,
  } = useSelector((s: RootState) => s.products);
  const { theme, tenant } = useSelector((s: RootState) => s.tenant);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | ""
  >("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    return subcategories.filter((sub) => sub.categoryId === selectedCategoryId);
  }, [subcategories, selectedCategoryId]);
  useEffect(() => {
    const now = Date.now();
    const shouldFetchCategories =
      categories.length === 0 &&
      !categoriesLoading &&
      (!lastFetched.categories || now - lastFetched.categories > 5 * 60 * 1000);
    const shouldFetchSubcategories =
      subcategories.length === 0 &&
      !subcategoriesLoading &&
      (!lastFetched.subcategories ||
        now - lastFetched.subcategories > 5 * 60 * 1000);
    if (shouldFetchCategories) {
      dispatch(fetchCategories());
    }
    if (shouldFetchSubcategories) {
      dispatch(fetchAllSubcategories());
    }
  }, [dispatch]);
  useEffect(() => {
    if (!items.length) dispatch(fetchAllProducts());
  }, [dispatch]);
  useEffect(() => {
    const hasCat = selectedCategoryId !== "";
    const hasSub = selectedSubCategoryId !== "";
    if (!hasCat && !hasSub) {
      dispatch(fetchAllProducts());
      return;
    }
    const payload: { category?: number; subCategory?: number } = {};
    if (hasCat) payload.category = selectedCategoryId as number;
    if (hasSub) payload.subCategory = selectedSubCategoryId as number;
    dispatch(fetchAllProducts(payload));
  }, [dispatch, selectedCategoryId, selectedSubCategoryId]);
  const allProducts: CardProduct[] = useMemo(
    () =>
      items.map((p) => {
        const imageUrl =
          p.images?.[0]?.imageUrl || p.images?.[0]?.url || "/vercel.svg";
        return {
          id: String(p.id),
          name: p.title ?? "Untitled",
          price: Number(p.price) || 0,
          originalPrice: Number(p.price) || 0,
          rating: 0,
          reviews: 0,
          image: imageUrl,
          category: p.brand || "all",
        };
      }),
    [items]
  );
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
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
      case "rating":
        return arr.sort((a, b) => b.rating - a.rating);
      case "newest":
        return arr.sort((a, b) => Number(b.id) - Number(a.id));
      default:
        return arr;
    }
  }, [filteredProducts, sortBy]);
  const pageVariant = theme.layout.homeVariant;
  const isEditorial = pageVariant === "editorial";
  const isModern = pageVariant === "modern";
  const isLuxury = pageVariant === "luxury";
  const storeName = tenant?.name || "Store";

  const titleClass =
    isEditorial || isLuxury
      ? "text-5xl font-semibold uppercase leading-none tracking-[0.06em] text-foreground sm:text-6xl"
      : isModern
      ? "text-5xl font-semibold leading-tight text-foreground sm:text-6xl"
      : "text-4xl font-light text-foreground mb-4";
  const controlsShellClass = isEditorial || isModern || isLuxury
    ? "border-y border-border bg-card px-4 py-5"
    : "mb-8";
  const inputShellClass = isEditorial || isLuxury
    ? "flex items-center space-x-2 border-b border-foreground/40 bg-transparent px-0 py-2 flex-1 max-w-md"
    : isModern
    ? "flex items-center space-x-2 border border-border bg-card px-4 py-2 flex-1 max-w-md"
    : "flex items-center space-x-2 bg-card rounded-lg px-4 py-2 flex-1 max-w-md";
  const selectClass = isEditorial || isLuxury
    ? "border border-border bg-background px-3 py-2 text-xs uppercase tracking-[0.18em] focus:outline-none focus:ring-2 focus:ring-ring"
    : isModern
    ? "border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    : "border border-border bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!isClient ? (
          <div
            className={
              isEditorial || isLuxury || isModern
                ? "mb-12 max-w-3xl"
                : "text-center mb-12"
            }
          >
            <h1 className={titleClass}>
              Our <span className="font-semibold">Products</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Browse products available from this store.
            </p>
          </div>
        ) : (
          <motion.div
            className={
              isEditorial || isLuxury || isModern
                ? "mb-14 max-w-3xl"
                : "text-center mb-12"
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
                  : "text-lg text-muted-foreground max-w-2xl mx-auto font-light"
              }
            >
              Browse products available from this store.
            </p>
          </motion.div>
        )}
        {!isClient ? (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-2 bg-card rounded-lg px-4 py-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-muted-foreground" />
                <div className="h-6 w-full bg-muted rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="border border-border rounded-lg px-3 py-2 w-32 h-10 bg-muted animate-pulse" />
                <div className="border border-border rounded-lg px-3 py-2 w-24 h-10 bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            className={controlsShellClass}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className={inputShellClass}>
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={
                    selectedCategoryId === "" ? "" : String(selectedCategoryId)
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    setSelectedCategoryId(v ? Number(v) : "");
                    setSelectedSubCategoryId("");
                  }}
                  className={selectClass}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {selectedCategoryId !== "" && (
                  <select
                    value={
                      selectedSubCategoryId === ""
                        ? ""
                        : String(selectedSubCategoryId)
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      setSelectedSubCategoryId(v ? Number(v) : "");
                    }}
                    className={selectClass}
                  >
                    <option value="">All Subcategories</option>
                    {filteredSubcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategoryId("");
                    setSelectedSubCategoryId("");
                  }}
                >
                  Clear
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={selectClass}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
        {!isClient ? (
          <div className="mb-6">
            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          </div>
        ) : (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-muted-foreground">
              {loading
                ? "Loading products..."
                : error
                ? `Error: ${error}`
                : `Showing ${sortedProducts.length} of ${allProducts.length} products`}
            </p>
          </motion.div>
        )}
        {!isClient ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg shadow-lg overflow-hidden"
              >
                <div className="aspect-square bg-muted animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className={
              isEditorial
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                : isLuxury || isModern
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {!loading &&
              !error &&
              sortedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
          </motion.div>
        )}
        {isClient && !loading && !error && sortedProducts.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategoryId("");
                setSelectedSubCategoryId("");
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
