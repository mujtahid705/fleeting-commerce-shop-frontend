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
import type { FormEvent } from "react";
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
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const { isLoggedIn, userData } = useAppSelector((state) => state.user);
  const { totalItems: cartItems, isOpen: isCartOpen } = useAppSelector(
    (state) => state.cart,
  );
  const { totalItems: favoriteItems, isOpen: isFavoritesOpen } = useAppSelector(
    (state) => state.favorites,
  );
  const { tenant, theme } = useAppSelector((state) => state.tenant);

  useEffect(() => {
    setMounted(true);
    dispatch(initializeAuth());
    dispatch(initializeCart());
    dispatch(initializeFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (pathname === "/products") {
      const params = new URLSearchParams(window.location.search);
      setHeaderSearchQuery(params.get("search") || "");
      return;
    }

    setHeaderSearchQuery("");
  }, [pathname]);

  const handleHeaderSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = headerSearchQuery.trim();
    const params = new URLSearchParams();

    if (query) {
      params.set("search", query);
    }

    router.push(
      params.toString() ? `/products?${params.toString()}` : "/products"
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };
  const handleProfileClick = () => {
    router.push("/profile");
  };
  const handleCartClick = () => {
    dispatch(toggleCart());
  };
  const handleFavoritesClick = () => {
    dispatch(toggleFavorites());
  };

  const storeName = tenant?.name || "Store";
  const rawLogoUrl = tenant?.brand?.logoUrl;
  const logoUrl = rawLogoUrl
    ? rawLogoUrl.startsWith("http://") || rawLogoUrl.startsWith("https://")
      ? rawLogoUrl
      : rawLogoUrl
    : null;
  const headerVariant = theme.layout.headerVariant;
  const tagline = tenant?.brand?.tagline;
  const isEditorial = headerVariant === "editorial";
  const isModern = headerVariant === "modern";
  const isLuxury = headerVariant === "luxury";
  const showAbout = tenant?.brand?.aboutPage?.isEnabled !== false;
  const showContact = tenant?.brand?.contactPage?.isEnabled !== false;
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    showAbout ? { name: "About", href: "/about" } : null,
    showContact ? { name: "Contact", href: "/contact" } : null,
  ].filter((item): item is { name: string; href: string } => Boolean(item));
  const actionItems = [
    {
      name: "Favorites",
      Icon: Heart,
      count: favoriteItems.toString(),
      onClick: handleFavoritesClick,
    },
    {
      name: "Cart",
      Icon: ShoppingCart,
      count: cartItems.toString(),
      onClick: handleCartClick,
    },
  ];

  if (isModern) {
    return (
      <>
        <motion.header
          className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-xl"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={storeName}
                  width={132}
                  height={48}
                  className="h-11 w-auto object-contain"
                  unoptimized
                />
              ) : (
                <div className="truncate text-xl font-semibold text-foreground">
                  {storeName}
                </div>
              )}
            </Link>

            <form
              onSubmit={handleHeaderSearchSubmit}
              className="order-3 flex w-full items-center gap-2 border border-border bg-background px-3 py-2 md:order-none md:w-[320px]"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={headerSearchQuery}
                onChange={(event) => setHeaderSearchQuery(event.target.value)}
                className="h-8 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
              />
            </form>

            <div className="flex items-center gap-2">
              {actionItems.map(({ name, Icon, count, onClick }) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  className="relative rounded-[var(--theme-button-radius)] border-border bg-background"
                  onClick={onClick}
                >
                  <Icon className="h-4 w-4" />
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-sm bg-primary px-1 text-[10px] text-primary-foreground">
                    {count}
                  </span>
                </Button>
              ))}
              {isLoggedIn ? (
                <DropdownMenu
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-[var(--theme-button-radius)] border-border bg-background"
                    >
                      <UserCircle className="h-4 w-4" />
                    </Button>
                  }
                >
                  <div className="border-b border-border px-4 py-2">
                    <p className="text-sm font-medium text-foreground">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userData?.email || ""}
                    </p>
                  </div>
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-[var(--theme-button-radius)] border-border bg-background"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <nav className="hidden border-t border-border bg-secondary/60 md:block">
            <div className="mx-auto flex max-w-7xl items-center gap-8 px-4 py-3 sm:px-6 lg:px-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                    mounted && pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </motion.header>
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => dispatch(toggleCart())}
        />
        <FavoritesDrawer
          isOpen={isFavoritesOpen}
          onClose={() => dispatch(toggleFavorites())}
        />
      </>
    );
  }

  if (isLuxury) {
    return (
      <>
        <motion.header
          className="sticky top-0 z-50 bg-foreground text-background"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto grid min-h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8">
            <nav className="hidden items-center gap-7 lg:flex">
              {navItems.slice(0, 2).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-xs font-semibold uppercase tracking-[0.22em] transition-colors ${
                    mounted && pathname === item.href
                      ? "text-primary"
                      : "text-background/65 hover:text-background"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <Link href="/" className="justify-self-center">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={storeName}
                  width={150}
                  height={54}
                  className="h-12 w-auto object-contain brightness-0 invert"
                  unoptimized
                />
              ) : (
                <div className="max-w-[220px] truncate text-center text-2xl font-semibold uppercase tracking-[0.22em]">
                  {storeName}
                </div>
              )}
            </Link>

            <div className="flex items-center justify-end gap-2">
              <nav className="mr-4 hidden items-center gap-7 lg:flex">
                {navItems.slice(2).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-xs font-semibold uppercase tracking-[0.22em] transition-colors ${
                      mounted && pathname === item.href
                        ? "text-primary"
                        : "text-background/65 hover:text-background"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              {actionItems.map(({ name, Icon, count, onClick }) => (
                <Button
                  key={name}
                  variant="ghost"
                  size="sm"
                  className="relative rounded-none text-background hover:bg-background/10 hover:text-background"
                  onClick={onClick}
                >
                  <Icon className="h-5 w-5" />
                  <span className="absolute -right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-primary px-1 text-[10px] text-primary-foreground">
                    {count}
                  </span>
                </Button>
              ))}
              {isLoggedIn ? (
                <DropdownMenu
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-none text-background hover:bg-background/10 hover:text-background"
                    >
                      <UserCircle className="h-5 w-5" />
                    </Button>
                  }
                >
                  <div className="border-b border-border px-4 py-2">
                    <p className="text-sm font-medium text-foreground">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userData?.email || ""}
                    </p>
                  </div>
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-none text-background hover:bg-background/10 hover:text-background"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="rounded-none text-background hover:bg-background/10 hover:text-background lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.header>
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => dispatch(toggleCart())}
        />
        <FavoritesDrawer
          isOpen={isFavoritesOpen}
          onClose={() => dispatch(toggleFavorites())}
        />
      </>
    );
  }

  if (isEditorial) {
    return (
      <>
        <motion.header
          className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {tagline && (
            <div className="border-b border-border/70 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              {tagline}
            </div>
          )}
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="min-w-0">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={storeName}
                  width={150}
                  height={54}
                  className="h-12 w-auto object-contain"
                  unoptimized
                />
              ) : (
                <div className="max-w-[190px] truncate text-2xl font-semibold uppercase tracking-[0.16em] text-foreground">
                  {storeName}
                </div>
              )}
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-xs font-semibold uppercase tracking-[0.24em] transition-colors ${
                    mounted && pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <form
                onSubmit={handleHeaderSearchSubmit}
                className="hidden items-center gap-2 border-b border-foreground/40 px-0 py-2 md:flex"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={headerSearchQuery}
                  onChange={(event) => setHeaderSearchQuery(event.target.value)}
                  className="h-7 w-32 border-0 bg-transparent p-0 text-xs uppercase tracking-[0.16em] focus-visible:ring-0 lg:w-44"
                />
              </form>
              {actionItems.map(({ name, Icon, count, onClick }) => (
                <Button
                  key={name}
                  variant="ghost"
                  size="sm"
                  className="relative rounded-none"
                  onClick={onClick}
                >
                  <Icon className="h-5 w-5" />
                  <span className="absolute -right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-none bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                    {count}
                  </span>
                </Button>
              ))}
              {isLoggedIn ? (
                <DropdownMenu
                  trigger={
                    <Button variant="ghost" size="sm" className="rounded-none">
                      <UserCircle className="h-5 w-5 text-foreground" />
                    </Button>
                  }
                >
                  <div className="border-b border-border px-4 py-2">
                    <p className="text-sm font-medium text-foreground">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userData?.email || ""}
                    </p>
                  </div>
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-none">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="rounded-none lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.header>
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => dispatch(toggleCart())}
        />
        <FavoritesDrawer
          isOpen={isFavoritesOpen}
          onClose={() => dispatch(toggleFavorites())}
        />
      </>
    );
  }

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
                    src={logoUrl}
                    alt={storeName}
                    width={120}
                    height={48}
                    className="h-12 w-auto object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {storeName}
                  </div>
                )}
              </Link>
            </motion.div>
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
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
              <form
                onSubmit={handleHeaderSearchSubmit}
                className="hidden md:flex items-center space-x-2 bg-secondary rounded-full px-4 py-2 max-w-md"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={headerSearchQuery}
                  onChange={(event) => setHeaderSearchQuery(event.target.value)}
                  className="border-0 bg-transparent focus:ring-0 text-sm"
                />
              </form>
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
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground">
                          {userData?.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {userData?.email || ""}
                        </p>
                      </div>
                      <DropdownMenuItem onClick={handleProfileClick}>
                        <UserCircle className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
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
