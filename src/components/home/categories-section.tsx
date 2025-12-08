"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
const categories = [
  {
    name: "Clothing",
    items: "2,451",
    icon: "👕",
    gradient: "from-rose-50 to-pink-50",
    hoverGradient: "from-rose-100 to-pink-100",
    iconBg: "bg-rose-100",
    textColor: "text-rose-600",
    description: "Trendy Fashion",
    href: "/products?category=clothing",
  },
  {
    name: "Cosmetics",
    items: "1,245",
    icon: "💄",
    gradient: "from-purple-50 to-violet-50",
    hoverGradient: "from-purple-100 to-violet-100",
    iconBg: "bg-purple-100",
    textColor: "text-purple-600",
    description: "Beauty & Care",
    href: "/products?category=cosmetics",
  },
  {
    name: "Bags & Purse",
    items: "865",
    icon: "👜",
    gradient: "from-amber-50 to-orange-50",
    hoverGradient: "from-amber-100 to-orange-100",
    iconBg: "bg-amber-100",
    textColor: "text-amber-600",
    description: "Luxury Accessories",
    href: "/products?category=bags",
  },
  {
    name: "Shoes",
    items: "1,764",
    icon: "👟",
    gradient: "from-emerald-50 to-teal-50",
    hoverGradient: "from-emerald-100 to-teal-100",
    iconBg: "bg-emerald-100",
    textColor: "text-emerald-600",
    description: "Designer Footwear",
    href: "/products?category=shoes",
  },
];
export function CategoriesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Browse by Category
          </motion.p>
          <h2 className="text-4xl font-light text-stone-800 mb-4">
            Find What You <span className="font-semibold">Love</span>
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto font-light">
            Explore our carefully curated collections designed to elevate your everyday style
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
            >
              <Link href={category.href}>
                <Card className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-gradient-to-br ${category.gradient} hover:${category.hoverGradient}`}>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-8">
                      <motion.div
                        className={`w-16 h-16 ${category.iconBg} rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                        whileHover={{ rotate: 5 }}
                      >
                        <span className="text-3xl">{category.icon}</span>
                      </motion.div>
                      <motion.div
                        className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                      >
                        <ArrowUpRight className={`w-5 h-5 ${category.textColor}`} />
                      </motion.div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-stone-800 group-hover:text-stone-900 transition-colors">
                        {category.name}
                      </h3>
                      <p className={`text-sm ${category.textColor} font-medium`}>
                        {category.description}
                      </p>
                      <p className="text-stone-500 text-sm pt-2">
                        {category.items} products
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
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
