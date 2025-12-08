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
  fetchSubcategories,
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
  }, [
    dispatch,
    categories.length,
    subcategories.length,
    categoriesLoading,
    subcategoriesLoading,
  ]);
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
      items.map((p) => ({
        id: String(p.id),
        name: p.title ?? "Untitled",
        price: Number(p.price) || 0,
        originalPrice: Number(p.price) || 0,
        rating: 0,
        reviews: 0,
        image: p.images?.[0]?.url || "/vercel.svg",
        category: p.brand || "all",
      })),
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
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isClient ? (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-stone-800 mb-4">
              Our <span className="font-semibold">Products</span>
            </h1>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto font-light">
              Discover our curated collection of premium products designed for
              the modern lifestyle
            </p>
          </div>
        ) : (
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-light text-stone-800 mb-4">
              Our <span className="font-semibold">Products</span>
            </h1>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto font-light">
              Discover our curated collection of premium products designed for
              the modern lifestyle
            </p>
          </motion.div>
        )}
        {!isClient ? (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400" />
                <div className="h-6 w-full bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="border border-gray-300 rounded-lg px-3 py-2 w-32 h-10 bg-gray-100 animate-pulse" />
                <div className="border border-gray-300 rounded-lg px-3 py-2 w-24 h-10 bg-gray-100 animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus:ring-0 text-sm"
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
                  className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
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
                    className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
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
                <Filter className="w-4 h-4 text-stone-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
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
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-gray-600">
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
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategoryId("");
                setSelectedSubCategoryId("");
              }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
