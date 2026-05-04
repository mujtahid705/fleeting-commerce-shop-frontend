"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/hooks/hooks";
import type { BrowseCategoryItem, Category } from "@/redux/slices/tenantSlice";

// Visual styling for categories
const CATEGORY_STYLES = [
  {
    gradient: "from-rose-50 to-pink-50",
    iconBg: "bg-rose-100",
    textColor: "text-rose-600",
  },
  {
    gradient: "from-purple-50 to-violet-50",
    iconBg: "bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    gradient: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-100",
    textColor: "text-amber-600",
  },
  {
    gradient: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
    textColor: "text-emerald-600",
  },
  {
    gradient: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    gradient: "from-cyan-50 to-sky-50",
    iconBg: "bg-cyan-100",
    textColor: "text-cyan-600",
  },
];

function getStyleForIndex(index: number) {
  return CATEGORY_STYLES[index % CATEGORY_STYLES.length];
}

export function CategoriesSection() {
  const { tenant, theme } = useAppSelector((state) => state.tenant);

  // API returns browseCategories directly under brand
  const browseCategoriesSection = tenant?.brand?.browseCategories;
  const sectionTitle = browseCategoriesSection?.title || "Browse by Category";

  // Extract categories from the API structure, fallback to tenant categories if empty
  const apiCategories = [...(browseCategoriesSection?.categories || [])]
    .sort(
      (a: BrowseCategoryItem, b: BrowseCategoryItem) =>
        a.displayOrder - b.displayOrder
    )
    .map((item: BrowseCategoryItem) => item.category);

  // Use API categories if available, otherwise fallback to tenant.categories
  const categories: Category[] =
    apiCategories && apiCategories.length > 0
      ? apiCategories
      : tenant?.categories || [];

  if (categories.length === 0) return null;
  const homeVariant = theme.layout.homeVariant;
  const storeName = tenant?.name || "Store";

  if (homeVariant === "modern") {
    return (
      <section className="border-y border-border bg-card py-[var(--theme-section-spacing)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">
                {sectionTitle}
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-card-foreground">
                Shop by category
              </h2>
            </div>
            <Link href="/products">
              <Button
                variant="outline"
                className="rounded-[var(--theme-button-radius)] border-border"
              >
                View all categories
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map((category: Category, index: number) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/products?category=${category.id}`}
                  className="group flex min-h-[190px] flex-col justify-between border border-border bg-background p-5 transition-all hover:-translate-y-1 hover:shadow-[var(--theme-card-shadow)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {category.subCategories?.length || 0} subcategories
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (homeVariant === "luxury") {
    return (
      <section className="bg-foreground py-[var(--theme-section-spacing)] text-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
              {sectionTitle}
            </p>
            <h2 className="mt-4 text-4xl font-semibold uppercase tracking-[0.08em] sm:text-5xl">
              {storeName} collections
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden border border-background/20 bg-background/20 md:grid-cols-4">
            {categories.slice(0, 4).map((category: Category, index: number) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/products?category=${category.id}`}
                  className="group block min-h-[250px] bg-foreground p-6 transition-colors hover:bg-background hover:text-foreground"
                >
                  <div className="flex h-full min-h-[202px] flex-col justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-3xl font-semibold uppercase leading-tight tracking-[0.06em]">
                        {category.name}
                      </h3>
                      <p className="mt-4 text-sm text-background/60 transition-colors group-hover:text-foreground/60">
                        {category.subCategories?.length || 0} subcategories
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (homeVariant === "editorial") {
    return (
      <section className="border-y border-border bg-card py-[var(--theme-section-spacing)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-accent">
                {sectionTitle}
              </p>
              <h2 className="mt-4 max-w-md text-4xl font-semibold uppercase leading-tight text-card-foreground sm:text-5xl">
                {storeName} categories
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-muted-foreground lg:justify-self-end">
              Browse available categories and subcategories from this store.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map((category: Category, index: number) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/products?category=${category.id}`}
                  className="group flex min-h-[260px] flex-col justify-between bg-background p-6 transition-colors hover:bg-foreground hover:text-background"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors group-hover:text-background/60">
                      0{index + 1}
                    </span>
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-semibold uppercase leading-none">
                      {category.name}
                    </h3>
                    <p className="mt-5 text-sm text-muted-foreground transition-colors group-hover:text-background/70">
                      {category.subCategories?.length || 0} subcategories
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex justify-end">
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="rounded-[var(--theme-button-radius)] border-foreground px-8 py-6 text-xs font-semibold uppercase tracking-[0.22em]"
              >
                All categories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.p
            className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            {sectionTitle}
          </motion.p>
          <h2 className="text-4xl font-light text-foreground mb-4">
            Find What You <span className="font-semibold">Love</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-light">
            Browse available product categories and subcategories.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((category: Category, index: number) => {
            const style = getStyleForIndex(index);
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/products?category=${category.id}`}>
                  <Card
                    className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-gradient-to-br ${style.gradient}`}
                  >
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-8">
                        <motion.div
                          className={`w-16 h-16 ${style.iconBg} rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                          whileHover={{ rotate: 5 }}
                        >
                          <ShoppingBag
                            className={`w-8 h-8 ${style.textColor}`}
                          />
                        </motion.div>
                        <motion.div className="w-10 h-10 bg-card/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <ArrowUpRight
                            className={`w-5 h-5 ${style.textColor}`}
                          />
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-card-foreground group-hover:text-foreground transition-colors">
                          {category.name}
                        </h3>
                        <p className={`text-sm ${style.textColor} font-medium`}>
                          {category.subCategories?.length || 0} subcategories
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/products">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 rounded-[var(--theme-button-radius)] border-2 border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 font-medium"
            >
              View All Categories
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
