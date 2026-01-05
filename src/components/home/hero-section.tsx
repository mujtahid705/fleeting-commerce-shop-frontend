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
  subtitle: "Discover curated collections designed for the modern you.",
  ctaText: "Shop Now",
  ctaLink: "/products",
  backgroundImage:
    "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg",
};

export function HeroSection() {
  const { tenant } = useAppSelector((state) => state.tenant);
  // API returns hero directly under brand, not under customization
  const customHero = tenant?.brand?.hero;
  const heroData = {
    ...DEFAULT_HERO,
    ...customHero,
  };

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
              className="mt-10 bg-stone-800 hover:bg-stone-900 text-white px-8 py-6 rounded-full text-sm font-medium tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-xl"
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
