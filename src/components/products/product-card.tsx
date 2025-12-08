"use client";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
}
interface ProductCardProps {
  product: Product;
  index: number;
}
export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
      }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="cursor-pointer overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 bg-white rounded-2xl">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-stone-50">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-9 h-9 p-0 rounded-full bg-white shadow-md hover:bg-stone-50 border-0"
                >
                  <Heart className="w-4 h-4 text-stone-500" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-9 h-9 p-0 rounded-full bg-white shadow-md hover:bg-stone-50 border-0"
                >
                  <ShoppingCart className="w-4 h-4 text-stone-500" />
                </Button>
              </motion.div>
            </div>
            {product.originalPrice > product.price && (
              <Badge className="absolute top-3 left-3 bg-rose-500 text-white border-0 shadow-sm z-20 rounded-full px-3">
                {Math.round((1 - product.price / product.originalPrice) * 100)}%
                OFF
              </Badge>
            )}
          </div>
        </Link>
        <div className="p-5">
          <div className="space-y-3">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-medium text-stone-800 leading-tight line-clamp-2 group-hover:text-stone-600 transition-colors duration-300">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? "text-amber-400 fill-current"
                        : "text-stone-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-stone-400">
                ({product.reviews})
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-stone-800">
                    ৳ {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-stone-400 line-through">
                      ৳ {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.originalPrice > product.price && (
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">
                    Save ৳{" "}
                    {(product.originalPrice - product.price).toLocaleString()}
                  </p>
                )}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Button
                  size="sm"
                  className="bg-stone-800 hover:bg-stone-900 text-white rounded-full w-10 h-10 p-0 shadow-md"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
