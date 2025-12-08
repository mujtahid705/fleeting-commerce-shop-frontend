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
import { useState, useEffect } from "react";
export function Footer() {
  const [, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <motion.footer
      className="bg-stone-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <motion.div
              className="flex items-center space-x-2 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <Link href="/">
                <div className="text-2xl font-light text-white">
                  Fleeting <span className="font-semibold">Commerce</span>
                </div>
              </Link>
            </motion.div>
            <p className="text-stone-400 mb-6 font-light leading-relaxed">
              Discover timeless pieces and modern essentials curated for the
              conscious lifestyle.
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
                  className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center text-stone-400 hover:bg-stone-700 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-300 mb-5">
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
                    className="text-stone-400 hover:text-white transition-colors font-light"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-300 mb-5">
              Categories
            </h3>
            <ul className="space-y-3">
              {[
                "Women's Fashion",
                "Men's Fashion",
                "Accessories",
                "Footwear",
                "Jewelry",
                "Bags",
              ].map((category) => (
                <li key={category}>
                  <Link
                    href={`/products?category=${category
                      .toLowerCase()
                      .replace("'s", "")
                      .replace(" ", "-")}`}
                    className="text-stone-400 hover:text-white transition-colors font-light"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-300 mb-5">
              Get in Touch
            </h3>
            <div className="space-y-4">
              {[
                { Icon: Mail, text: "hello@fleetingcommerce.com" },
                { Icon: Phone, text: "+1 (555) 123-4567" },
                { Icon: MapPin, text: "123 Fashion St, Style City" },
              ].map(({ Icon, text }, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-stone-400" />
                  </div>
                  <span className="text-stone-400 text-sm font-light">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-500 text-sm font-light">
              © 2025 Fleeting Commerce. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-stone-500 hover:text-stone-300 text-sm font-light transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-stone-500 hover:text-stone-300 text-sm font-light transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
