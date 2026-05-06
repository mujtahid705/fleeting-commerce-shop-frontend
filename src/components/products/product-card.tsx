"use client";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { useAppSelector } from "@/hooks/hooks";
import { formatCurrency } from "@/lib/discount-pricing";

interface Product {
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
}
interface ProductCardProps {
  product: Product;
  index: number;
}
export function ProductCard({ product, index }: ProductCardProps) {
  const { theme } = useAppSelector((state) => state.tenant);
  const productCardVariant = theme.layout.productCardVariant;
  const isEditorial = productCardVariant === "editorial";
  const isModern = productCardVariant === "modern";
  const isLuxury = productCardVariant === "luxury";
  const hasSale = product.originalPrice > product.price;
  const saleLabel =
    product.discountPercentage && product.discountPercentage > 0
      ? `${product.discountPercentage}% off`
      : product.saleTitle || "Sale";

  if (isModern) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          delay: index * 0.05,
        }}
        viewport={{ once: true }}
        className="group"
      >
        <div className="h-full border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--theme-card-shadow)]">
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {hasSale && (
                <Badge className="absolute left-3 top-3 rounded-[var(--theme-button-radius)] bg-primary text-primary-foreground">
                  {saleLabel}
                </Badge>
              )}
            </div>
          </Link>
          <div className="p-4">
            <Link href={`/products/${product.id}`}>
              <h3 className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-card-foreground group-hover:text-primary">
                {product.name}
              </h3>
            </Link>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div className="min-w-0">
                <span className="text-lg font-semibold text-card-foreground">
                  {formatCurrency(product.price)}
                </span>
                {hasSale && (
                  <span className="ml-2 text-xs text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                className="h-9 rounded-[var(--theme-button-radius)] px-3"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isLuxury) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          delay: index * 0.07,
        }}
        viewport={{ once: true }}
        className="group"
      >
        <div className="h-full bg-card">
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-[3/4] overflow-hidden border border-border bg-muted">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              {hasSale && (
                <Badge className="absolute left-4 top-4 rounded-none border-0 bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
                  {saleLabel}
                </Badge>
              )}
            </div>
          </Link>
          <div className="px-1 py-5">
            <Link href={`/products/${product.id}`}>
              <h3 className="line-clamp-2 min-h-12 text-sm font-semibold uppercase leading-6 tracking-[0.08em] text-card-foreground group-hover:text-primary">
                {product.name}
              </h3>
            </Link>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div className="min-w-0">
                <span className="text-sm font-semibold text-primary">
                  {formatCurrency(product.price)}
                </span>
                {hasSale && (
                  <span className="ml-2 text-xs text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-none border-border px-3 text-xs uppercase tracking-[0.16em] text-foreground hover:bg-primary hover:text-primary-foreground"
              >
                View
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isEditorial) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.06,
        }}
        viewport={{ once: true }}
        className="group"
      >
        <div className="border border-border bg-card">
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {hasSale && (
                <Badge className="absolute left-4 top-4 rounded-none border-0 bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                  {saleLabel}
                </Badge>
              )}
              <div className="absolute inset-x-0 bottom-0 translate-y-full border-t border-border bg-background/95 p-4 backdrop-blur transition-transform duration-300 group-hover:translate-y-0">
                <Button
                  size="sm"
                  className="w-full rounded-[var(--theme-button-radius)] text-xs font-semibold uppercase tracking-[0.18em]"
                >
                  Quick view
                  <ShoppingCart className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Link>
          <div className="p-4">
            <Link href={`/products/${product.id}`}>
              <h3 className="min-h-12 text-sm font-semibold uppercase leading-6 tracking-[0.08em] text-card-foreground transition-colors group-hover:text-accent">
                {product.name}
              </h3>
            </Link>
            <div className="mt-5 flex items-end justify-between gap-4 border-t border-border pt-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Price
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold text-card-foreground">
                    {formatCurrency(product.price)}
                  </span>
                  {hasSale && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 rounded-none p-0"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

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
      <Card className="cursor-pointer overflow-hidden border border-border bg-card shadow-sm transition-all duration-500 hover:shadow-xl rounded-[var(--theme-card-radius)]">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-muted">
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
                  className="w-9 h-9 p-0 rounded-full bg-card shadow-md hover:bg-muted border-0"
                >
                  <Heart className="w-4 h-4 text-muted-foreground" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-9 h-9 p-0 rounded-full bg-card shadow-md hover:bg-muted border-0"
                >
                  <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                </Button>
              </motion.div>
            </div>
            {hasSale && (
              <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground border-0 shadow-sm z-20 rounded-full px-3">
                {saleLabel.toUpperCase()}
              </Badge>
            )}
          </div>
        </Link>
        <div className="p-5 h-48 flex flex-col">
          <div className="space-y-3 flex-1 flex flex-col">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-medium text-card-foreground leading-tight line-clamp-2 h-12 group-hover:text-primary transition-colors duration-300">
                {product.name}
              </h3>
            </Link>
            {product.rating > 0 && (
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? "text-accent fill-current"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1 mt-auto">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-card-foreground">
                    {formatCurrency(product.price)}
                  </span>
                  {hasSale && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="h-5 mt-0.5">
                  {hasSale && (
                    <p className="text-xs text-primary font-medium">
                      Save{" "}
                      {formatCurrency(product.originalPrice - product.price)}
                    </p>
                  )}
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-10 h-10 p-0 shadow-md"
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
