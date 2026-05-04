import { themes } from "@/lib/themes";
import type { TenantInfo } from "@/redux/slices/tenantSlice";

export const THEME_PREVIEW_DOMAIN = "theme-preview";

export type PreviewProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
};

export function isThemePreviewHostname(hostname: string): boolean {
  return hostname.split(".")[0] === THEME_PREVIEW_DOMAIN;
}

export function getThemePreviewIndexFromPath(pathname: string): number {
  const themeId = Number(pathname.split("/").filter(Boolean)[0] || 1);
  if (!Number.isInteger(themeId)) return 1;
  return Math.max(1, Math.min(themeId, themes.length));
}

const previewCategories = [
  {
    id: 101,
    name: "Essentials",
    slug: "essentials",
    subCategories: [
      { id: 1001, name: "Daily Wear", slug: "daily-wear" },
      { id: 1002, name: "Accessories", slug: "accessories" },
    ],
  },
  {
    id: 102,
    name: "New Arrivals",
    slug: "new-arrivals",
    subCategories: [
      { id: 1003, name: "Fresh Picks", slug: "fresh-picks" },
      { id: 1004, name: "Limited Edit", slug: "limited-edit" },
    ],
  },
  {
    id: 103,
    name: "Home Studio",
    slug: "home-studio",
    subCategories: [
      { id: 1005, name: "Decor", slug: "decor" },
      { id: 1006, name: "Tabletop", slug: "tabletop" },
    ],
  },
  {
    id: 104,
    name: "Gift Sets",
    slug: "gift-sets",
    subCategories: [
      { id: 1007, name: "Curated Boxes", slug: "curated-boxes" },
      { id: 1008, name: "Seasonal", slug: "seasonal" },
    ],
  },
];

const previewImages = [
  "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg",
  "https://images.pexels.com/photos/6068960/pexels-photo-6068960.jpeg",
  "https://images.pexels.com/photos/7679863/pexels-photo-7679863.jpeg",
  "https://images.pexels.com/photos/7319307/pexels-photo-7319307.jpeg",
  "https://images.pexels.com/photos/5417630/pexels-photo-5417630.jpeg",
  "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg",
  "https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg",
  "https://images.pexels.com/photos/7319305/pexels-photo-7319305.jpeg",
];

export function createThemePreviewTenant(themeIndex: number): TenantInfo {
  const theme = themes[getThemePreviewIndexFromPath(`/${themeIndex}`) - 1];

  return {
    id: "theme-preview",
    name: `${theme.name} Preview`,
    domain: THEME_PREVIEW_DOMAIN,
    address: "123 Preview Avenue, Demo City",
    categories: previewCategories,
    brand: {
      logoUrl: null,
      tagline: "A storefront preview using sample content only",
      description:
        "Explore the layout, spacing, color palette, and product presentation before applying this theme to a live store.",
      theme: theme.id,
      hero: {
        title: `${theme.name} storefront preview`,
        subtitle:
          "This sample page uses dummy products, categories, images, and copy so you can review the theme without loading store data.",
        ctaText: "Preview collection",
        ctaLink: "#preview-products",
        backgroundImage: previewImages[theme.id - 1] || previewImages[0],
      },
      browseCategories: {
        title: "Sample Categories",
        categories: previewCategories.map((category, index) => ({
          categoryId: category.id,
          displayOrder: index + 1,
          category,
        })),
      },
      featuredCategories: {
        title: "Sample Products",
        categories: previewCategories.slice(0, 2).map((category, index) => ({
          categoryId: category.id,
          displayOrder: index + 1,
          category,
        })),
      },
      exclusiveSection: {
        title: "Preview Highlights",
        products: getThemePreviewExclusiveProducts().map((product, index) => ({
          productId: product.id,
          customTitle: product.name,
          customImage: product.image,
          displayOrder: index + 1,
        })),
      },
      footer: {
        companyName: `${theme.name} Preview`,
        address: "123 Preview Avenue, Demo City",
        phone: "+1 (555) 010-2026",
        email: "preview@example.com",
        copyrightText: `Theme preview for ${theme.name}. Sample content only.`,
        quickLinks: [
          { label: "Home", url: "/" },
          { label: "Products", url: "#preview-products" },
          { label: "Categories", url: "#preview-categories" },
          { label: "Contact", url: "#preview-contact" },
        ],
      },
    },
  };
}

export function getThemePreviewProductsByCategory(): Record<
  number,
  PreviewProduct[]
> {
  return previewCategories.reduce<Record<number, PreviewProduct[]>>(
    (productsByCategory, category, categoryIndex) => {
      productsByCategory[category.id] = Array.from({ length: 5 }, (_, index) => {
        const imageIndex = (categoryIndex * 2 + index) % previewImages.length;
        const price = 1200 + categoryIndex * 450 + index * 180;

        return {
          id: `preview-${category.id}-${index + 1}`,
          name: `${category.name} Sample ${index + 1}`,
          price,
          originalPrice: index % 2 === 0 ? price + 350 : price,
          rating: 4.4,
          reviews: 18 + index * 7,
          image: previewImages[imageIndex],
        };
      });

      return productsByCategory;
    },
    {}
  );
}

export function getThemePreviewExclusiveProducts(): PreviewProduct[] {
  return [
    {
      id: "preview-highlight-1",
      name: "Signature Preview Piece",
      price: 2490,
      originalPrice: 2890,
      rating: 4.8,
      reviews: 42,
      image: previewImages[4],
    },
    {
      id: "preview-highlight-2",
      name: "Curated Sample Bundle",
      price: 3190,
      originalPrice: 3190,
      rating: 4.7,
      reviews: 36,
      image: previewImages[5],
    },
    {
      id: "preview-highlight-3",
      name: "Limited Layout Showcase",
      price: 1890,
      originalPrice: 2190,
      rating: 4.6,
      reviews: 28,
      image: previewImages[6],
    },
    {
      id: "preview-highlight-4",
      name: "Theme Sample Gift Set",
      price: 2750,
      originalPrice: 3150,
      rating: 4.9,
      reviews: 53,
      image: previewImages[7],
    },
  ];
}
