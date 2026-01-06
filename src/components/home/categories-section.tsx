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
  const { tenant } = useAppSelector((state) => state.tenant);

  // API returns browseCategories directly under brand
  const browseCategoriesSection = tenant?.brand?.browseCategories;
  const sectionTitle = browseCategoriesSection?.title || "Browse by Category";

  // Extract categories from the API structure, fallback to tenant categories if empty
  const apiCategories = [...(browseCategoriesSection?.categories || [])]
    .sort(
      (a: BrowseCategoryItem, b: BrowseCategoryItem) =>
        a.displayOrder - b.displayOrder
    )
    .map((item: BrowseCategoryItem) => item.category)
    .filter((category): category is Category => category != null);

  // Use API categories if available, otherwise fallback to tenant.categories
  const categories: Category[] =
    apiCategories && apiCategories.length > 0
      ? apiCategories
      : tenant?.categories || [];

  if (categories.length === 0) return null;

  return (
    <section className="py-24 bg-white">
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
            className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            {sectionTitle}
          </motion.p>
          <h2 className="text-4xl font-light text-stone-800 mb-4">
            Find What You <span className="font-semibold">Love</span>
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto font-light">
            Explore our carefully curated collections designed to elevate your
            everyday style
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
                        <motion.div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <ArrowUpRight
                            className={`w-5 h-5 ${style.textColor}`}
                          />
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-stone-800 group-hover:text-stone-900 transition-colors">
                          {category.name}
                        </h3>
                        <p className={`text-sm ${style.textColor} font-medium`}>
                          {category.subCategories?.length || 0} subcategories
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
              className="px-8 py-6 rounded-full border-2 border-stone-300 text-stone-700 hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-all duration-300 font-medium"
            >
              View All Categories
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
