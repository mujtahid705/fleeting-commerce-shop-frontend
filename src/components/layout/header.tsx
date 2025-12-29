"use client";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  LogOut,
  UserCircle,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CartDrawer } from "@/components/ui/cart-drawer";
import { FavoritesDrawer } from "@/components/ui/favorites-drawer";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks/hooks";
import { logout, initializeAuth } from "@/redux/slices/userSlice";
import { initializeCart, toggleCart } from "@/redux/slices/cartSlice";
import {
  initializeFavorites,
  toggleFavorites,
} from "@/redux/slices/favoritesSlice";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const { isLoggedIn, userData } = useAppSelector((state) => state.user);
  const { totalItems: cartItems, isOpen: isCartOpen } = useAppSelector(
    (state) => state.cart
  );
  const { totalItems: favoriteItems, isOpen: isFavoritesOpen } = useAppSelector(
    (state) => state.favorites
  );
  const { tenant } = useAppSelector((state) => state.tenant);

  useEffect(() => {
    setMounted(true);
    dispatch(initializeAuth());
    dispatch(initializeCart());
    dispatch(initializeFavorites());
  }, [dispatch]);
  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };
  const handleCartClick = () => {
    dispatch(toggleCart());
  };
  const handleFavoritesClick = () => {
    dispatch(toggleFavorites());
  };

  const storeName = tenant?.name || "Store";
  const logoUrl = tenant?.brand?.logoUrl;

  return (
    <>
      <motion.header
        className="bg-card shadow-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Link href="/">
                {logoUrl ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${logoUrl}`}
                    alt={storeName}
                    width={350}
                    height={120}
                    className="h-24 w-auto object-contain"
                  />
                ) : (
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {storeName}
                  </div>
                )}
              </Link>
            </motion.div>
            <nav className="hidden md:flex space-x-8">
              {[
                { name: "Home", href: "/" },
                { name: "Shop", href: "/products" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <motion.div key={item.name}>
                  <Link
                    href={item.href}
                    className={`text-muted-foreground hover:text-foreground transition-colors ${
                      mounted && pathname === item.href
                        ? "text-foreground font-semibold"
                        : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-secondary rounded-full px-4 py-2 max-w-md">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="border-0 bg-transparent focus:ring-0 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                {[
                  {
                    Icon: Heart,
                    count: favoriteItems.toString(),
                    href: null,
                    onClick: handleFavoritesClick,
                  },
                  {
                    Icon: ShoppingCart,
                    count: cartItems.toString(),
                    href: null,
                    onClick: handleCartClick,
                  },
                ].map(({ Icon, count, href, onClick }, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {href ? (
                      <Link href={href}>
                        <Button variant="ghost" size="sm" className="relative">
                          <Icon className="w-5 h-5" />
                          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {count}
                          </span>
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="relative"
                        onClick={onClick || undefined}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {count}
                        </span>
                      </Button>
                    )}
                  </motion.div>
                ))}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isLoggedIn ? (
                    <DropdownMenu
                      trigger={
                        <Button variant="ghost" size="sm" className="relative">
                          <UserCircle className="w-5 h-5 text-foreground" />
                          <span className="absolute -top-1 -right-1 bg-primary w-2 h-2 rounded-full"></span>
                        </Button>
                      }
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {userData?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userData?.email || ""}
                        </p>
                      </div>
                      {userData?.role === "user" && (
                        <>
                          <Link href="/profile">
                            <DropdownMenuItem>
                              <UserCircle className="w-4 h-4 mr-2" />
                              Profile
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {(userData?.role === "admin" ||
                        userData?.role === "superAdmin") && (
                        <>
                          <Link href="/dashboard">
                            <DropdownMenuItem>
                              <LayoutDashboard className="w-4 h-4 mr-2" />
                              Dashboard
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenu>
                  ) : (
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        <User className="w-5 h-5" />
                      </Button>
                    </Link>
                  )}
                </motion.div>
              </div>
              <motion.div className="md:hidden" whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>
      <CartDrawer isOpen={isCartOpen} onClose={() => dispatch(toggleCart())} />
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => dispatch(toggleFavorites())}
      />
    </>
  );
}
