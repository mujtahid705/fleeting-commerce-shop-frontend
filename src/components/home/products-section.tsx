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
import {
  getThemePreviewExclusiveProducts,
  getThemePreviewProductsByCategory,
} from "@/lib/theme-preview";
import {
  getOriginalPrice,
  getSaleDiscountAmount,
  getSaleDiscountPercentage,
  getSalePrice,
  formatCurrency,
  type ProductPricing,
} from "@/lib/discount-pricing";

type CardProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  saleTitle?: string;
  discountPercentage?: number;
  saleDiscountAmount?: number;
};

type ExclusiveProductCard = {
  product: CardProduct;
  customTitle?: string;
  customImage?: string;
};

type ProductSource = {
  id: string | number;
  title?: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  image?: string;
  pricing?: ProductPricing;
  images?: Array<{ url?: string; imageUrl?: string }>;
};

// Default exclusive section for when API returns empty products array
const DEFAULT_EXCLUSIVE = {
  title: "Exclusive Collection",
  description: "Products highlighted by this store",
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
  const { tenant, theme, isThemePreview } = useAppSelector(
    (state) => state.tenant
  );

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
    ExclusiveProductCard[]
  >([]);
  const [exclusiveLoading, setExclusiveLoading] = React.useState(false);

  const previewCategoryProducts = React.useMemo(
    () => getThemePreviewProductsByCategory(),
    []
  );
  const previewExclusiveProducts = React.useMemo(
    () =>
      getThemePreviewExclusiveProducts().map((product) => {
        const item: ExclusiveProductCard = { product };
        item.customTitle = product.name;
        item.customImage = product.image;
        return item;
      }),
    []
  );

  const mapToCard = React.useCallback(
    (items: ProductSource[]): CardProduct[] =>
      items.map((p) => ({
        id: String(p.id),
        name: p.title ?? p.name ?? "Untitled",
        price: getSalePrice(p),
        originalPrice: getOriginalPrice(p),
        rating: Number(p.rating) || 0,
        reviews: Number(p.reviews) || 0,
        image:
          p.image ||
          p.images?.[0]?.imageUrl ||
          p.images?.[0]?.url ||
          "/vercel.svg",
        saleTitle: p.pricing?.activeSaleDiscount?.title,
        discountPercentage: getSaleDiscountPercentage(p),
        saleDiscountAmount: getSaleDiscountAmount(p),
      })),
    []
  );

  // Fetch products for featured categories
  React.useEffect(() => {
    if (isThemePreview) return;
    if (featuredCategories.length === 0) return;

    let active = true;
    let lastFocusRefreshAt = 0;

    const fetchFeaturedCategoryProducts = () => {
      featuredCategories.forEach((category) => {
        setLoading((prev) => ({ ...prev, [category.id]: true }));

        dispatch(fetchAllProducts({ category: category.id }))
          .unwrap()
          .then((products) => {
            if (active) {
              setCategoryProducts((prev) => ({
                ...prev,
                [category.id]: mapToCard(products),
              }));
              setError((prev) => ({ ...prev, [category.id]: null }));
            }
          })
          .catch((e: unknown) => {
            const errorMessage = e instanceof Error ? e.message : String(e);
            if (active) {
              setError((prev) => ({
                ...prev,
                [category.id]: errorMessage || "Failed to load",
              }));
            }
          })
          .finally(() => {
            if (active) {
              setLoading((prev) => ({ ...prev, [category.id]: false }));
            }
          });
      });
    };

    const refreshFeaturedCategoryProductsOnce = () => {
      const now = Date.now();
      if (now - lastFocusRefreshAt < 500) return;
      lastFocusRefreshAt = now;
      fetchFeaturedCategoryProducts();
    };

    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") {
        refreshFeaturedCategoryProductsOnce();
      }
    };

    refreshFeaturedCategoryProductsOnce();
    window.addEventListener("focus", refreshFeaturedCategoryProductsOnce);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      active = false;
      window.removeEventListener("focus", refreshFeaturedCategoryProductsOnce);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [dispatch, featuredCategories, isThemePreview, mapToCard]);

  // Fetch exclusive products by productId
  React.useEffect(() => {
    if (isThemePreview) return;
    if (exclusiveProducts.length === 0) return;

    let active = true;
    let lastFocusRefreshAt = 0;

    const fetchExclusiveProducts = () => {
      setExclusiveLoading(true);

      const fetches = exclusiveProducts.map(async (item) => {
        try {
          const productData = await dispatch(
            fetchProductById(item.productId)
          ).unwrap();
          if (!productData) return null;

          const exclusiveProduct: ExclusiveProductCard = {
            product: mapToCard([productData])[0],
          };
          if (item.customTitle) exclusiveProduct.customTitle = item.customTitle;
          if (item.customImage) exclusiveProduct.customImage = item.customImage;

          return exclusiveProduct;
        } catch (e) {
          console.error(
            `Failed to fetch exclusive product ${item.productId}:`,
            e
          );
          return null;
        }
      });

      Promise.all(fetches)
        .then((results) => {
          if (active) {
            setExclusiveProductsData(
              results.filter(
                (item): item is ExclusiveProductCard => item !== null
              )
            );
          }
        })
        .finally(() => {
          if (active) {
            setExclusiveLoading(false);
          }
        });
    };

    const refreshExclusiveProductsOnce = () => {
      const now = Date.now();
      if (now - lastFocusRefreshAt < 500) return;
      lastFocusRefreshAt = now;
      fetchExclusiveProducts();
    };

    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") {
        refreshExclusiveProductsOnce();
      }
    };

    refreshExclusiveProductsOnce();
    window.addEventListener("focus", refreshExclusiveProductsOnce);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      active = false;
      window.removeEventListener("focus", refreshExclusiveProductsOnce);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [dispatch, exclusiveProducts, isThemePreview, mapToCard]);

  // Show exclusive section even without featured categories
  const hasFeaturedCategories = featuredCategories.length > 0;
  const hasExclusiveProducts =
    exclusiveProducts.length > 0 ||
    (isThemePreview && previewExclusiveProducts.length > 0);
  const displayCategoryProducts = isThemePreview
    ? previewCategoryProducts
    : categoryProducts;
  const displayExclusiveProductsData = isThemePreview
    ? previewExclusiveProducts
    : exclusiveProductsData;
  const displayExclusiveLoading = isThemePreview ? false : exclusiveLoading;
  const homeVariant = theme.layout.homeVariant;
  const isEditorial = homeVariant === "editorial";
  const isModern = homeVariant === "modern";
  const isLuxury = homeVariant === "luxury";
  const storeName = tenant?.name || "Store";

  if (isLuxury) {
    return (
      <>
        {hasFeaturedCategories &&
          featuredCategories.map((category, categoryIndex) => (
            <section
              key={category.id}
              className={`py-[var(--theme-section-spacing)] ${
                categoryIndex % 2 === 0
                  ? "bg-background text-foreground"
                  : "bg-foreground text-background"
              }`}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="mx-auto mb-14 max-w-3xl text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.32em] ${
                      categoryIndex % 2 === 0 ? "text-primary" : "text-primary"
                    }`}
                  >
                    {featuredSectionTitle}
                  </p>
                  <h2 className="mt-4 text-4xl font-semibold uppercase tracking-[0.08em] sm:text-5xl">
                    {category.name}
                  </h2>
                </motion.div>

                {loading[category.id] && (
                  <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
                  </div>
                )}
                {error[category.id] && !loading[category.id] && (
                  <div className="border border-border bg-card py-8 text-center text-muted-foreground">
                    {error[category.id]}
                  </div>
                )}
                {!loading[category.id] && !error[category.id] && (
                  <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                    {displayCategoryProducts[category.id]
                      ?.slice(0, 4)
                      .map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          index={index}
                        />
                      ))}
                  </div>
                )}
              </div>
            </section>
          ))}

        {hasExclusiveProducts && (
          <section className="border-y border-border bg-card py-[var(--theme-section-spacing)]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                    {storeName}
                  </p>
                  <h2 className="mt-4 text-4xl font-semibold uppercase tracking-[0.08em] text-card-foreground sm:text-5xl">
                    {exclusiveTitle}
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-7 text-muted-foreground">
                  {exclusiveProducts.length} products from {storeName}.
                </p>
              </motion.div>

              {displayExclusiveLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
                </div>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {displayExclusiveProductsData.map((item, index) => {
                    const displayImage = item.customImage
                      ? resolveImageUrl(item.customImage)
                      : item.product.image;
                    const displayTitle = item.customTitle || item.product.name;

                    return (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        viewport={{ once: true }}
                      >
                        <Link href={`/products/${item.product.id}`}>
                          <div className="group">
                            <div className="relative aspect-[3/4] overflow-hidden border border-border bg-background">
                              <Image
                                src={displayImage}
                                alt={displayTitle}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                              />
                            </div>
                            <div className="mt-4 border-t border-border pt-4">
                              <h3 className="line-clamp-2 text-base font-semibold uppercase tracking-[0.08em] text-card-foreground">
                                {displayTitle}
                              </h3>
                              <p className="mt-2 text-sm font-semibold text-primary">
                                {formatCurrency(item.product.price)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}
      </>
    );
  }

  if (isEditorial) {
    return (
      <>
        {hasFeaturedCategories &&
          featuredCategories.map((category, categoryIndex) => (
            <section
              key={category.id}
              className="border-b border-border bg-background py-[var(--theme-section-spacing)]"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="mb-12 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="h-px w-10 bg-accent" />
                      <span className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                        Featured {String(categoryIndex + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="text-4xl font-semibold uppercase leading-tight text-foreground sm:text-5xl">
                      {category.name}
                    </h2>
                  </div>
                  <div className="flex flex-col gap-5 lg:items-end">
                    <Link href={`/products?category=${category.id}`}>
                      <Button
                        variant="outline"
                        className="rounded-[var(--theme-button-radius)] border-foreground px-6 text-xs font-semibold uppercase tracking-[0.2em]"
                      >
                        View all <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>

                {loading[category.id] && (
                  <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
                  </div>
                )}
                {error[category.id] && !loading[category.id] && (
                  <div className="border border-border bg-card py-8 text-center text-muted-foreground">
                    {error[category.id]}
                  </div>
                )}
                {!loading[category.id] && !error[category.id] && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {displayCategoryProducts[category.id]
                      ?.slice(0, 4)
                      .map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          index={index}
                        />
                      ))}
                  </div>
                )}
              </div>
            </section>
          ))}

        {hasExclusiveProducts && (
          <section className="bg-foreground py-[var(--theme-section-spacing)] text-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                className="mb-12 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-background/60">
                    {storeName}
                  </p>
                  <h2 className="mt-4 max-w-3xl text-4xl font-semibold uppercase leading-tight sm:text-6xl">
                    {exclusiveTitle}
                  </h2>
                </div>
                <p className="max-w-md text-sm leading-7 text-background/65 lg:justify-self-end">
                  {exclusiveProducts.length} products from {storeName}.
                </p>
              </motion.div>

              {displayExclusiveLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                </div>
              ) : (
                <div className="grid gap-px overflow-hidden bg-background/20 lg:grid-cols-4">
                  {displayExclusiveProductsData.map((item, index) => {
                    const displayImage = item.customImage
                      ? resolveImageUrl(item.customImage)
                      : item.product.image;
                    const displayTitle = item.customTitle || item.product.name;

                    return (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        viewport={{ once: true }}
                      >
                        <Link
                          href={`/products/${item.product.id}`}
                          className="group block bg-foreground"
                        >
                          <div className="relative aspect-[4/5] overflow-hidden bg-background/10">
                            <Image
                              src={displayImage}
                              alt={displayTitle}
                              fill
                              className="object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                              unoptimized
                            />
                          </div>
                          <div className="p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-background/45">
                              Product
                            </p>
                            <h3 className="mt-3 min-h-12 text-base font-semibold uppercase leading-6">
                              {displayTitle}
                            </h3>
                            <p className="mt-4 text-sm font-semibold">
                              {formatCurrency(item.product.price)}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <div className="mt-12 text-right">
                <Link href="/products">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-[var(--theme-button-radius)] px-8 py-6 text-xs font-semibold uppercase tracking-[0.22em]"
                  >
                    Explore collection <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </>
    );
  }

  return (
    <>
      {/* Featured Category Sections */}
      {hasFeaturedCategories &&
        featuredCategories.map((category, categoryIndex) => (
          <section
            key={category.id}
            className={
              isModern
                ? "border-b border-border bg-background py-16"
                : `py-12 ${
                    categoryIndex % 2 === 0
                      ? "bg-gradient-to-b from-card to-background"
                      : "bg-card"
                  }`
            }
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className={
                  isModern
                    ? "mb-10 grid gap-5 border-b border-border pb-8 md:grid-cols-[1fr_auto] md:items-end"
                    : "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-14 gap-4"
                }
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
                  <h2 className="text-3xl font-light text-foreground">
                    {category.name}
                  </h2>
                </div>
                <Link href={`/products?category=${category.id}`}>
                  <Button
                    variant="outline"
                    className="rounded-[var(--theme-button-radius)] px-6 border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                  >
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>

              <div
                className={
                  isModern
                    ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                }
              >
                {loading[category.id] && (
                  <div className="col-span-full flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}
                {error[category.id] && !loading[category.id] && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {error[category.id]}
                  </div>
                )}
                {!loading[category.id] &&
                  !error[category.id] &&
                  displayCategoryProducts[category.id]
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
        <section
          className={
            isModern
              ? "relative overflow-hidden border-y border-border bg-card py-20"
              : "py-24 bg-gradient-to-br from-secondary via-background to-secondary relative overflow-hidden"
          }
        >
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
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
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {exclusiveTitle}
                </span>
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-4xl font-light text-foreground mb-4">
                <span className="font-semibold">{exclusiveTitle}</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto font-light">
                {DEFAULT_EXCLUSIVE.description}
              </p>
            </motion.div>

            {/* Exclusive Products Grid */}
            {displayExclusiveLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayExclusiveProductsData.map((item, index) => {
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
                          <div className="relative aspect-square rounded-[var(--theme-image-radius)] overflow-hidden mb-4 bg-card shadow-md group-hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src={displayImage}
                              alt={displayTitle}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {displayTitle}
                            </h3>
                            <p className="text-primary font-semibold mt-1">
                              {formatCurrency(item.product.price)}
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
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[var(--theme-button-radius)] px-8 py-6 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
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
