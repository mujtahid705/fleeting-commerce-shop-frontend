"use client";

import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/hooks/hooks";
import { Category } from "@/redux/slices/tenantSlice";
import Image from "next/image";

export function Footer() {
  const { tenant } = useAppSelector((state) => state.tenant);

  const storeName = tenant?.name || "Store";
  const logoUrl = tenant?.brand?.logoUrl;
  const description = tenant?.brand?.description;
  const address = tenant?.address;
  const categories = tenant?.categories || [];

  return (
    <motion.footer
      className="bg-foreground text-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <motion.div
              className="flex items-center space-x-2 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <Link href="/">
                {logoUrl ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${logoUrl}`}
                    alt={storeName}
                    width={350}
                    height={120}
                    className="h-24 w-auto object-contain brightness-0 invert"
                  />
                ) : (
                  <div className="text-2xl font-bold text-background">
                    {storeName}
                  </div>
                )}
              </Link>
            </motion.div>
            <p className="text-background/60 mb-6 font-light leading-relaxed">
              {description || "Your trusted shopping destination."}
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Youtube, href: "#" },
              ].map(({ Icon, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center text-background/60 hover:bg-background/20 hover:text-background transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/70 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Shop", href: "/products" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-background/60 hover:text-background transition-colors font-light"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/70 mb-5">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.length > 0 ? (
                categories.slice(0, 6).map((category: Category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products?category=${category.id}`}
                      className="text-background/60 hover:text-background transition-colors font-light"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-background/40 font-light">
                  No categories available
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/70 mb-5">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-background/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-background/60" />
                </div>
                <span className="text-background/60 text-sm font-light">
                  support@store.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-background/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-background/60" />
                </div>
                <span className="text-background/60 text-sm font-light">
                  Contact Support
                </span>
              </div>
              {address && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-background/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-background/60" />
                  </div>
                  <span className="text-background/60 text-sm font-light">
                    {address}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/40 text-sm font-light">
              © {new Date().getFullYear()} {storeName}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-background/40 hover:text-background/70 text-sm font-light transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-background/40 hover:text-background/70 text-sm font-light transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          <p className="text-center text-background/30 text-xs mt-4">
            Powered by{" "}
            <a
              href="https://fleetingcommerce.com"
              className="hover:text-background/50 transition-colors"
            >
              Fleeting Commerce
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
