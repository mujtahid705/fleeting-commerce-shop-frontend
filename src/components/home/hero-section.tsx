"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] bg-gradient-to-b from-stone-50 via-amber-50/30 to-white overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
          <motion.div
            className="space-y-10 z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-stone-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-stone-600">
                New Season Collection
              </span>
            </motion.div>
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-5xl lg:text-7xl font-light text-stone-800 leading-tight tracking-tight">
                Discover
                <br />
                <span className="font-semibold bg-gradient-to-r from-stone-700 via-emerald-700 to-stone-600 bg-clip-text text-transparent">
                  Timeless
                </span>
                <br />
                Elegance
              </h1>
              <p className="text-lg text-stone-500 max-w-md leading-relaxed font-light">
                Curated collections that blend comfort with style. Experience
                fashion that feels as good as it looks.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-stone-800 hover:bg-stone-900 text-white px-8 py-6 rounded-full text-base font-medium shadow-lg shadow-stone-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-stone-300/60"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400 px-8 py-6 rounded-full text-base font-medium transition-all duration-300"
                >
                  Our Story
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="flex items-center gap-8 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="text-center">
                <p className="text-2xl font-semibold text-stone-800">500+</p>
                <p className="text-sm text-stone-500">Products</p>
              </div>
              <div className="w-px h-10 bg-stone-200"></div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-stone-800">50k+</p>
                <p className="text-sm text-stone-500">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-stone-200"></div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-stone-800">4.9</p>
                <p className="text-sm text-stone-500">Rating</p>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-stone-300/40">
                <ImageWithFallback
                  src="https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg"
                  alt="Elegant Fashion"
                  className="w-full h-[600px] object-cover"
                  width={600}
                  height={700}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent"></div>
              </div>
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl shadow-stone-200/60 border border-stone-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      Premium Quality
                    </p>
                    <p className="text-xs text-stone-500">
                      Handcrafted with care
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl shadow-stone-200/60 border border-stone-100"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <p className="text-xs text-stone-500 mb-1">Starting from</p>
                <p className="text-xl font-semibold text-stone-800">৳999</p>
              </motion.div>
              <div className="absolute top-1/4 -right-8 w-16 h-16 bg-amber-100 rounded-full opacity-60 blur-sm"></div>
              <div className="absolute bottom-1/3 -left-10 w-20 h-20 bg-emerald-100 rounded-full opacity-50 blur-sm"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
