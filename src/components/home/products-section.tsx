"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { fetchAllProducts } from "@/redux/slices/productsSlice";
import { ArrowRight, Sparkles } from "lucide-react";
type CardProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
};
export function ProductsSection() {
  const dispatch = useDispatch<AppDispatch>();
  const [gadgets, setGadgets] = React.useState<CardProduct[]>([]);
  const [womenProducts, setWomenProducts] = React.useState<CardProduct[]>([]);
  const [loading, setLoading] = React.useState({ g: true, w: true });
  const [error, setError] = React.useState<{
    g: string | null;
    w: string | null;
  }>({ g: null, w: null });
  React.useEffect(() => {
    let active = true;
    const mapToCard = (
      items: Array<{
        id: string;
        title?: string;
        price?: number;
        images?: Array<{ url?: string }>;
      }>
    ): CardProduct[] =>
      items.map((p) => ({
        id: String(p.id),
        name: p.title ?? "Untitled",
        price: Number(p.price) || 0,
        originalPrice: Number(p.price) || 0,
        rating: 0,
        reviews: 0,
        image: p.images?.[0]?.url
          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${p.images[0].url}`
          : "/vercel.svg",
      }));
    (async () => {
      try {
        const g = await dispatch(fetchAllProducts({ category: 2 })).unwrap();
        if (active) setGadgets(mapToCard(g));
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        if (active) setError((s) => ({ ...s, g: errorMessage || "Failed" }));
      } finally {
        if (active) setLoading((s) => ({ ...s, g: false }));
      }
      try {
        const w = await dispatch(fetchAllProducts({ category: 1 })).unwrap();
        if (active) setWomenProducts(mapToCard(w));
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        if (active) setError((s) => ({ ...s, w: errorMessage || "Failed" }));
      } finally {
        if (active) setLoading((s) => ({ ...s, w: false }));
      }
    })();
    return () => {
      active = false;
    };
  }, [dispatch]);
  return (
    <>
      <section className="py-20 bg-gradient-to-b from-white to-stone-50">
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
                  New Arrivals
                </span>
              </div>
              <h2 className="text-3xl font-light text-stone-800">
                Latest <span className="font-semibold">Gadgets</span>
              </h2>
              <p className="text-stone-500 mt-2 font-light">
                Discover the newest tech essentials
              </p>
            </div>
            <Link href="/products">
              <Button
                variant="outline"
                className="rounded-full px-6 border-stone-300 text-stone-600 hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-all duration-300"
              >
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {loading.g && (
              <div className="col-span-full flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
              </div>
            )}
            {error.g && !loading.g && (
              <div className="col-span-full text-center py-8 text-stone-500">
                {error.g}
              </div>
            )}
            {!loading.g &&
              !error.g &&
              gadgets
                .slice(0, 5)
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
      <section className="py-24 bg-gradient-to-br from-stone-100 via-amber-50/50 to-stone-100 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/50 to-rose-200/50 rounded-[3rem] rotate-6"></div>
                <Image
                  src="https://images.pexels.com/photos/2085118/pexels-photo-2085118.jpeg"
                  alt="Women's Fashion"
                  width={320}
                  height={320}
                  className="relative w-full h-full object-cover rounded-[3rem] shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-lg">
                  <span className="text-2xl">👗</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="order-1 lg:order-2 space-y-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <p className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">
                  Exclusive Collection
                </p>
                <h2 className="text-5xl font-light text-stone-800 leading-tight mb-6">
                  Women&apos;s
                  <br />
                  <span className="font-semibold text-stone-900">Fashion</span>
                  <br />
                  <span className="text-stone-600">Collection</span>
                </h2>
                <p className="text-lg text-stone-500 font-light max-w-md">
                  Discover your signature style with our thoughtfully curated
                  women&apos;s collection
                </p>
              </div>
              <Link href="/products?category=womens">
                <Button
                  size="lg"
                  className="bg-stone-800 text-white hover:bg-stone-900 rounded-full px-8 py-6 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Explore Collection <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
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
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                  Trending
                </span>
              </div>
              <h2 className="text-3xl font-light text-stone-800">
                Fashion <span className="font-semibold">Essentials</span>
              </h2>
              <p className="text-stone-500 mt-2 font-light">
                Curated picks for every occasion
              </p>
            </div>
            <Link href="/products">
              <Button
                variant="outline"
                className="rounded-full px-6 border-stone-300 text-stone-600 hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-all duration-300"
              >
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {loading.w && (
              <div className="col-span-full flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
              </div>
            )}
            {error.w && !loading.w && (
              <div className="col-span-full text-center py-8 text-stone-500">
                {error.w}
              </div>
            )}
            {!loading.w &&
              !error.w &&
              womenProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
