"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/hooks/hooks";
import type { HeroCustomization } from "@/redux/slices/tenantSlice";

const DEFAULT_HERO: HeroCustomization = {
  title: "Elevate Your Style",
  subtitle: "Browse products and categories available from this store.",
  ctaText: "Shop Now",
  ctaLink: "/products",
  backgroundImage:
    "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg",
};

export function HeroSection() {
  const { tenant, theme } = useAppSelector((state) => state.tenant);
  // API returns hero directly under brand, not under customization
  const customHero = tenant?.brand?.hero;
  const heroData = {
    ...DEFAULT_HERO,
    ...customHero,
  };
  const homeVariant = theme.layout.homeVariant;
  const isEditorial = homeVariant === "editorial";
  const isModern = homeVariant === "modern";
  const isLuxury = homeVariant === "luxury";
  const isNatural = homeVariant === "natural";
  const storeName = tenant?.name || "Store";
  const categoryCount = tenant?.categories?.length || 0;

  if (isModern) {
    return (
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto grid min-h-[78vh] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="mb-5 text-sm font-semibold text-primary">
              {storeName}
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
              {heroData.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              {heroData.subtitle}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="rounded-[var(--theme-button-radius)] px-7 py-6 font-semibold"
              >
                <Link href={heroData.ctaLink || "/products"}>
                  {heroData.ctaText}
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-[var(--theme-button-radius)] px-7 py-6 font-semibold"
              >
                <Link href="/products">Browse products</Link>
              </Button>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-2 border border-border bg-card">
              <div className="border-r border-border p-5">
                <p className="text-2xl font-semibold text-foreground">
                  {categoryCount}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Categories
                </p>
              </div>
              <div className="p-5">
                <p className="text-2xl font-semibold text-foreground">
                  {tenant?.brand?.featuredCategories?.categories?.length || 0}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Featured
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative min-h-[420px] lg:min-h-[610px]"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="absolute left-8 top-8 h-[82%] w-[82%] border border-border bg-secondary" />
            <div className="absolute inset-y-0 right-0 w-[86%] overflow-hidden rounded-[var(--theme-image-radius)] shadow-[var(--theme-card-shadow)]">
              <ImageWithFallback
                src={heroData.backgroundImage || DEFAULT_HERO.backgroundImage || ""}
                alt="Hero"
                className="h-full w-full object-cover"
                width={1300}
                height={1300}
              />
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (isLuxury) {
    return (
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
              {storeName}
            </p>
            <h1 className="text-5xl font-semibold uppercase leading-[0.95] tracking-[0.08em] sm:text-7xl">
              {heroData.title}
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-background/70 sm:text-lg">
              {heroData.subtitle}
            </p>
            <Button
              size="lg"
              asChild
              className="mt-9 rounded-[var(--theme-button-radius)] bg-primary px-8 py-6 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground hover:bg-primary/90"
            >
              <Link href={heroData.ctaLink || "/products"}>
                {heroData.ctaText}
                <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mx-auto mt-14 max-w-5xl border border-background/20 p-3"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          >
            <div className="relative aspect-[16/8] overflow-hidden rounded-[var(--theme-image-radius)] bg-background/10">
              <ImageWithFallback
                src={heroData.backgroundImage || DEFAULT_HERO.backgroundImage || ""}
                alt="Hero"
                className="h-full w-full object-cover"
                width={1600}
                height={900}
              />
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (isEditorial) {
    return (
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <motion.div
            className="relative z-10 order-2 pb-8 lg:order-1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-accent">
              {storeName}
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold uppercase leading-[0.95] tracking-[0.03em] text-foreground sm:text-6xl lg:text-7xl">
              {heroData.title}
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
              {heroData.subtitle}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                size="lg"
                asChild
                className="rounded-[var(--theme-button-radius)] px-8 py-6 text-xs font-semibold uppercase tracking-[0.22em]"
              >
                <Link href={heroData.ctaLink || "/products"}>
                  {heroData.ctaText}
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
              <Link
                href="/products"
                className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground underline-offset-8 transition-colors hover:text-foreground hover:underline"
              >
                View collection
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative order-1 min-h-[420px] lg:order-2 lg:min-h-[620px]"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="absolute right-0 top-0 h-[76%] w-[82%] border border-border bg-secondary" />
            <div className="absolute bottom-0 left-0 h-[88%] w-[84%] overflow-hidden rounded-[var(--theme-image-radius)] shadow-[var(--theme-card-shadow)]">
              <ImageWithFallback
                src={heroData.backgroundImage || DEFAULT_HERO.backgroundImage || ""}
                alt="Hero"
                className="h-full w-full object-cover"
                width={1200}
                height={1400}
              />
            </div>
            <div className="absolute bottom-8 right-2 max-w-[220px] bg-background px-5 py-4 shadow-[var(--theme-card-shadow)] sm:right-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {tenant?.brand?.featuredCategories?.title || "Featured"}
              </p>
              <p className="mt-2 text-sm font-medium leading-5 text-foreground">
                {tenant?.brand?.tagline || storeName}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (isNatural) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-secondary">
        <div className="mx-auto grid min-h-[82vh] max-w-7xl grid-cols-1 items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <p className="mb-5 text-sm font-medium text-primary">
              {storeName}
            </p>
            <h1 className="max-w-2xl text-5xl font-light leading-tight text-foreground sm:text-6xl lg:text-7xl">
              {heroData.title}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
              {heroData.subtitle}
            </p>
            <Button
              size="lg"
              asChild
              className="mt-9 rounded-[var(--theme-button-radius)] px-8 py-6 font-medium"
            >
              <Link href={heroData.ctaLink || "/products"}>
                {heroData.ctaText}
                <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="relative min-h-[430px] lg:min-h-[590px]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-primary/15" />
            <div className="absolute bottom-8 right-0 h-40 w-40 rounded-full bg-accent/20" />
            <div className="absolute inset-8 overflow-hidden rounded-[2rem] shadow-[var(--theme-card-shadow)]">
              <ImageWithFallback
                src={heroData.backgroundImage || DEFAULT_HERO.backgroundImage || ""}
                alt="Hero"
                className="h-full w-full object-cover"
                width={1200}
                height={1400}
              />
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[85vh] bg-neutral-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={heroData.backgroundImage || DEFAULT_HERO.backgroundImage || ""}
          alt="Hero"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[85vh] px-4">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {heroData.title}
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-white/80 font-light max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {heroData.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Button
              size="lg"
              asChild
              className="mt-10 rounded-[var(--theme-button-radius)] bg-primary px-8 py-6 text-sm font-medium uppercase tracking-wider text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl"
            >
              <Link href={heroData.ctaLink || "/products"}>
                {heroData.ctaText}
                <ArrowRight className="w-4 h-4 ml-3" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 to-transparent z-10" />
    </section>
  );
}
