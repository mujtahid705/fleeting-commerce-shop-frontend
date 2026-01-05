"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import {
  fetchAllProducts,
  fetchProductById,
} from "@/redux/slices/productsSlice";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAppSelector } from "@/hooks/hooks";
import type {
  Category,
  FeaturedCategoryItem,
  ExclusiveProductItem,
} from "@/redux/slices/tenantSlice";

type CardProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
};

// Default exclusive section for when API returns empty products array
const DEFAULT_EXCLUSIVE = {
  title: "Exclusive Collection",
  description:
    "Discover your signature style with our thoughtfully curated collection",
};

function resolveImageUrl(src: string | undefined | null): string {
  const fallback = "/vercel.svg";
  if (!src || typeof src !== "string" || src.trim() === "") return fallback;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/")) {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
    return `${baseUrl}${src}`;
  }
  return fallback;
}

export function ProductsSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { tenant } = useAppSelector((state) => state.tenant);

  // API returns sections directly under brand, not under customization
  const featuredCategoriesSection = tenant?.brand?.featuredCategories;
  const featuredSectionTitle =
    featuredCategoriesSection?.title || "Featured Categories";

  // Memoize categories to prevent infinite re-renders
  const featuredCategories: Category[] = React.useMemo(() => {
    return [...(featuredCategoriesSection?.categories || [])]
      .sort(
        (a: FeaturedCategoryItem, b: FeaturedCategoryItem) =>
          a.displayOrder - b.displayOrder
      )
      .map((item: FeaturedCategoryItem) => item.category);
  }, [featuredCategoriesSection?.categories]);

  // Exclusive section from API (directly under brand)
  const exclusiveSectionData = tenant?.brand?.exclusiveSection;
  const exclusiveTitle = exclusiveSectionData?.title || DEFAULT_EXCLUSIVE.title;

  // Memoize exclusive products to prevent infinite re-renders
  const exclusiveProducts = React.useMemo(() => {
    return [...(exclusiveSectionData?.products || [])].sort(
      (a: ExclusiveProductItem, b: ExclusiveProductItem) =>
        a.displayOrder - b.displayOrder
    );
  }, [exclusiveSectionData?.products]);

  // State for products by category
  const [categoryProducts, setCategoryProducts] = React.useState<
    Record<number, CardProduct[]>
  >({});
  const [loading, setLoading] = React.useState<Record<number, boolean>>({});
  const [error, setError] = React.useState<Record<number, string | null>>({});

  // State for exclusive products (fetched by productId)
  const [exclusiveProductsData, setExclusiveProductsData] = React.useState<
    Array<{ product: CardProduct; customTitle?: string; customImage?: string }>
  >([]);
  const [exclusiveLoading, setExclusiveLoading] = React.useState(false);

  const mapToCard = React.useCallback(
    (
      items: Array<{
        id: string;
        title?: string;
        price?: number;
        images?: Array<{ url?: string; imageUrl?: string }>;
      }>
    ): CardProduct[] =>
      items.map((p) => ({
        id: String(p.id),
        name: p.title ?? "Untitled",
        price: Number(p.price) || 0,
        originalPrice: Number(p.price) || 0,
        rating: 0,
        reviews: 0,
        image: p.images?.[0]?.imageUrl || p.images?.[0]?.url || "/vercel.svg",
      })),
    []
  );

  // Fetch products for featured categories
  React.useEffect(() => {
    if (featuredCategories.length === 0) return;

    let active = true;

    const fetchCategoryProducts = async (category: Category) => {
      setLoading((prev) => ({ ...prev, [category.id]: true }));

      try {
        const products = await dispatch(
          fetchAllProducts({ category: category.id })
        ).unwrap();
        if (active) {
          setCategoryProducts((prev) => ({
            ...prev,
            [category.id]: mapToCard(products),
          }));
        }
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        if (active) {
          setError((prev) => ({
            ...prev,
            [category.id]: errorMessage || "Failed to load",
          }));
        }
      } finally {
        if (active) {
          setLoading((prev) => ({ ...prev, [category.id]: false }));
        }
      }
    };

    featuredCategories.forEach((category) => {
      fetchCategoryProducts(category);
    });

    return () => {
      active = false;
    };
  }, [dispatch, featuredCategories, mapToCard]);

  // Fetch exclusive products by productId
  React.useEffect(() => {
    if (exclusiveProducts.length === 0) return;

    let active = true;
    setExclusiveLoading(true);

    const fetchExclusiveProducts = async () => {
      const results: Array<{
        product: CardProduct;
        customTitle?: string;
        customImage?: string;
      }> = [];

      for (const item of exclusiveProducts) {
        try {
          const productData = await dispatch(
            fetchProductById(item.productId)
          ).unwrap();
          if (active && productData) {
            const cardProduct = mapToCard([productData])[0];
            results.push({
              product: cardProduct,
              customTitle: item.customTitle,
              customImage: item.customImage,
            });
          }
        } catch (e) {
          console.error(
            `Failed to fetch exclusive product ${item.productId}:`,
            e
          );
        }
      }

      if (active) {
        setExclusiveProductsData(results);
        setExclusiveLoading(false);
      }
    };

    fetchExclusiveProducts();

    return () => {
      active = false;
    };
  }, [dispatch, exclusiveProducts, mapToCard]);

  // Show exclusive section even without featured categories
  const hasFeaturedCategories = featuredCategories.length > 0;
  const hasExclusiveProducts = exclusiveProducts.length > 0;

  return (
    <>
      {/* Featured Category Sections */}
      {hasFeaturedCategories &&
        featuredCategories.map((category, categoryIndex) => (
          <section
            key={category.id}
            className={`py-12 ${
              categoryIndex % 2 === 0
                ? "bg-gradient-to-b from-white to-stone-50"
                : "bg-white"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-14 gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
                  <h2 className="text-3xl font-light text-stone-800">
                    {category.name}
                  </h2>
                  <p className="text-stone-500 mt-2 font-light">
                    {category.subCategories?.length || 0} subcategories
                    available
                  </p>
                </div>
                <Link href={`/products?category=${category.id}`}>
                  <Button
                    variant="outline"
                    className="rounded-full px-6 border-stone-300 text-stone-600 hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-all duration-300"
                  >
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {loading[category.id] && (
                  <div className="col-span-full flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
                  </div>
                )}
                {error[category.id] && !loading[category.id] && (
                  <div className="col-span-full text-center py-8 text-stone-500">
                    {error[category.id]}
                  </div>
                )}
                {!loading[category.id] &&
                  !error[category.id] &&
                  categoryProducts[category.id]
                    ?.slice(0, 5)
                    .map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                      />
                    ))}
              </div>
            </div>
          </section>
        ))}

      {/* Exclusive Section - Only show if there are exclusive products */}
      {hasExclusiveProducts && (
        <section className="py-24 bg-gradient-to-br from-stone-100 via-amber-50/50 to-stone-100 relative overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                  {exclusiveTitle}
                </span>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-4xl font-light text-stone-800 mb-4">
                Handpicked <span className="font-semibold">For You</span>
              </h2>
              <p className="text-stone-500 max-w-lg mx-auto font-light">
                {DEFAULT_EXCLUSIVE.description}
              </p>
            </motion.div>

            {/* Exclusive Products Grid */}
            {exclusiveLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {exclusiveProductsData.map((item, index) => {
                  // Use custom image if provided, otherwise use product image
                  const displayImage = item.customImage
                    ? resolveImageUrl(item.customImage)
                    : item.product.image;
                  const displayTitle = item.customTitle || item.product.name;

                  return (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link href={`/products/${item.product.id}`}>
                        <div className="group cursor-pointer">
                          <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-white shadow-md group-hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src={displayImage}
                              alt={displayTitle}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-medium text-stone-800 group-hover:text-stone-900 transition-colors line-clamp-2">
                              {displayTitle}
                            </h3>
                            <p className="text-stone-600 font-semibold mt-1">
                              ${item.product.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* View All Button */}
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-stone-800 text-white hover:bg-stone-900 rounded-full px-8 py-6 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Explore Collection <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
