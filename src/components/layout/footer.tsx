"use client";

import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
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
  const rawLogoUrl = tenant?.brand?.logoUrl;
  const logoUrl = rawLogoUrl
    ? rawLogoUrl.startsWith("http://") || rawLogoUrl.startsWith("https://")
      ? rawLogoUrl
      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${rawLogoUrl}`
    : null;
  const description = tenant?.brand?.description;
  const categories = tenant?.categories || [];

  // API returns footer directly under brand, not under customization
  const footerData = tenant?.brand?.footer;
  const companyName = footerData?.companyName || storeName;
  const contactEmail =
    footerData?.email || `support@${tenant?.domain || "store"}`;
  const contactPhone = footerData?.phone || "";
  const address = footerData?.address || tenant?.address;
  const copyrightText =
    footerData?.copyrightText ||
    `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`;
  const socialLinks = footerData?.socialLinks;
  const quickLinks =
    footerData?.quickLinks && footerData.quickLinks.length > 0
      ? footerData.quickLinks
      : [
          { label: "Home", url: "/" },
          { label: "Shop", url: "/products" },
          { label: "About", url: "/about" },
          { label: "Contact", url: "/contact" },
        ];

  // Build social media links array from API data
  const socialMediaItems = [
    { Icon: Facebook, href: socialLinks?.facebook, name: "Facebook" },
    { Icon: Twitter, href: socialLinks?.twitter, name: "Twitter" },
    { Icon: Instagram, href: socialLinks?.instagram, name: "Instagram" },
    { Icon: Youtube, href: socialLinks?.youtube, name: "YouTube" },
    { Icon: Linkedin, href: socialLinks?.linkedin, name: "LinkedIn" },
  ].filter((item) => item.href); // Only show icons with URLs

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
                    src={logoUrl}
                    alt={storeName}
                    width={350}
                    height={120}
                    className="h-24 w-auto object-contain brightness-0 invert"
                    unoptimized
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
            {socialMediaItems.length > 0 && (
              <div className="flex space-x-4">
                {socialMediaItems.map(({ Icon, href, name }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center text-background/60 hover:bg-background/20 hover:text-background transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/70 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.url}
                    className="text-background/60 hover:text-background transition-colors font-light"
                  >
                    {item.label}
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
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-background/60 text-sm font-light hover:text-background transition-colors"
                >
                  {contactEmail}
                </a>
              </div>
              {contactPhone && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-background/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-background/60" />
                  </div>
                  <a
                    href={`tel:${contactPhone}`}
                    className="text-background/60 text-sm font-light hover:text-background transition-colors"
                  >
                    {contactPhone}
                  </a>
                </div>
              )}
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
              {copyrightText}
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
