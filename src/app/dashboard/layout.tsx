"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Files,
  Users,
  Package,
  Settings,
  FolderOpen,
  Tags,
} from "lucide-react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, userData } = useSelector((s: RootState) => s.user);
  const router = useRouter();
  const pathname = usePathname();
  React.useEffect(() => {
    if (!isLoggedIn || !["admin", "superAdmin"].includes(userData.role)) {
      router.replace("/");
    }
  }, [isLoggedIn, userData.role, router]);
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/dashboard/products", icon: Files },
    { name: "Categories", href: "/dashboard/categories", icon: FolderOpen },
    { name: "Subcategories", href: "/dashboard/subcategories", icon: Tags },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Orders", href: "/dashboard/orders", icon: Package },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];
  return (
    <div className="min-h-[calc(100vh-64px-240px)] bg-stone-50">
      <div className="border-b border-stone-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="font-semibold text-stone-800">Admin Panel</div>
          <div className="text-sm text-stone-500">
            {userData.name} ({userData.role})
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <aside className="rounded-xl border border-stone-100 bg-white shadow-sm p-3 h-fit md:sticky md:top-[calc(64px+56px+16px)]">
          <nav className="space-y-1">
            {navItems.map(({ name, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} className="block">
                  <motion.div
                    whileHover={{ x: 2 }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-stone-100 text-stone-800 border border-stone-200"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-h-[60vh]">{children}</main>
      </div>
    </div>
  );
}
