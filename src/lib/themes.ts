// Theme configuration for multi-tenant white-label e-commerce
// Themes are accessible by index as stored in backend.

export type StorefrontVariant = "natural" | "modern" | "luxury" | "editorial";

export interface ThemeColors {
  // Light mode colors (HSL values without 'hsl()' wrapper)
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  radius: string;
}

export interface ThemeColorsDark {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface Theme {
  id: number;
  slug: string;
  name: string;
  description: string;
  light: ThemeColors;
  dark: ThemeColorsDark;
  layout: {
    homeVariant: StorefrontVariant;
    headerVariant: StorefrontVariant;
    footerVariant: StorefrontVariant;
    productCardVariant: StorefrontVariant;
  };
  appearance: {
    sectionSpacing: string;
    imageRadius: string;
    cardRadius: string;
    cardShadow: string;
    buttonRadius: string;
    headingTracking: string;
    textTransform: "none" | "uppercase";
  };
  // Additional brand-specific styles
  gradients: {
    primary: string;
    secondary: string;
    hero: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export const themes: Theme[] = [
  // Theme 1: Natural/Earthy (Default - Current theme)
  {
    id: 1,
    slug: "natural",
    name: "Natural",
    description: "Earthy tones with green accents - warm and organic feel",
    light: {
      background: "35 40% 94%",
      foreground: "25 30% 15%",
      card: "40 45% 98%",
      cardForeground: "25 30% 15%",
      popover: "40 45% 98%",
      popoverForeground: "25 30% 15%",
      primary: "145 50% 42%",
      primaryForeground: "0 0% 100%",
      secondary: "35 35% 85%",
      secondaryForeground: "25 30% 15%",
      muted: "35 30% 88%",
      mutedForeground: "25 20% 40%",
      accent: "30 70% 60%",
      accentForeground: "25 30% 15%",
      destructive: "0 70% 50%",
      destructiveForeground: "0 0% 100%",
      border: "35 30% 82%",
      input: "35 30% 82%",
      ring: "145 50% 42%",
      radius: "1rem",
    },
    dark: {
      background: "20 14% 10%",
      foreground: "40 33% 98%",
      card: "20 14% 14%",
      cardForeground: "40 33% 98%",
      popover: "20 14% 14%",
      popoverForeground: "40 33% 98%",
      primary: "150 25% 50%",
      primaryForeground: "0 0% 100%",
      secondary: "20 14% 18%",
      secondaryForeground: "40 33% 98%",
      muted: "20 14% 18%",
      mutedForeground: "40 20% 65%",
      accent: "270 30% 60%",
      accentForeground: "0 0% 100%",
      destructive: "0 65% 50%",
      destructiveForeground: "0 0% 100%",
      border: "20 14% 22%",
      input: "20 14% 22%",
      ring: "150 25% 50%",
    },
    layout: {
      homeVariant: "natural",
      headerVariant: "natural",
      footerVariant: "natural",
      productCardVariant: "natural",
    },
    appearance: {
      sectionSpacing: "6rem",
      imageRadius: "1.5rem",
      cardRadius: "1.25rem",
      cardShadow: "0 12px 30px hsl(25 30% 15% / 0.08)",
      buttonRadius: "999px",
      headingTracking: "0",
      textTransform: "none",
    },
    gradients: {
      primary:
        "linear-gradient(135deg, hsl(145 50% 42%) 0%, hsl(145 50% 32%) 100%)",
      secondary:
        "linear-gradient(135deg, hsl(35 35% 85%) 0%, hsl(35 30% 78%) 100%)",
      hero: "linear-gradient(135deg, hsl(35 40% 94%) 0%, hsl(145 30% 88%) 100%)",
    },
    fonts: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
  },

  // Theme 2: Modern Blue (Tech/Corporate)
  {
    id: 2,
    slug: "modern-blue",
    name: "Modern Blue",
    description: "Clean blue tones - professional and trustworthy",
    light: {
      background: "210 55% 92%",
      foreground: "220 40% 12%",
      card: "210 60% 97%",
      cardForeground: "220 40% 12%",
      popover: "210 60% 97%",
      popoverForeground: "220 40% 12%",
      primary: "215 85% 48%",
      primaryForeground: "0 0% 100%",
      secondary: "210 50% 82%",
      secondaryForeground: "220 40% 12%",
      muted: "210 45% 85%",
      mutedForeground: "215 25% 35%",
      accent: "200 75% 50%",
      accentForeground: "0 0% 100%",
      destructive: "0 75% 55%",
      destructiveForeground: "0 0% 100%",
      border: "210 40% 78%",
      input: "210 40% 78%",
      ring: "215 85% 48%",
      radius: "0.75rem",
    },
    dark: {
      background: "222 47% 8%",
      foreground: "210 40% 98%",
      card: "222 47% 12%",
      cardForeground: "210 40% 98%",
      popover: "222 47% 12%",
      popoverForeground: "210 40% 98%",
      primary: "217 91% 60%",
      primaryForeground: "0 0% 100%",
      secondary: "222 47% 16%",
      secondaryForeground: "210 40% 98%",
      muted: "222 47% 16%",
      mutedForeground: "215 20% 65%",
      accent: "262 83% 68%",
      accentForeground: "0 0% 100%",
      destructive: "0 72% 51%",
      destructiveForeground: "0 0% 100%",
      border: "222 47% 20%",
      input: "222 47% 20%",
      ring: "217 91% 60%",
    },
    layout: {
      homeVariant: "modern",
      headerVariant: "modern",
      footerVariant: "modern",
      productCardVariant: "modern",
    },
    appearance: {
      sectionSpacing: "5.5rem",
      imageRadius: "0.375rem",
      cardRadius: "0.5rem",
      cardShadow: "0 18px 44px hsl(220 40% 12% / 0.12)",
      buttonRadius: "0.5rem",
      headingTracking: "0",
      textTransform: "none",
    },
    gradients: {
      primary:
        "linear-gradient(135deg, hsl(215 85% 48%) 0%, hsl(215 85% 38%) 100%)",
      secondary:
        "linear-gradient(135deg, hsl(210 50% 82%) 0%, hsl(210 45% 75%) 100%)",
      hero: "linear-gradient(135deg, hsl(210 55% 92%) 0%, hsl(200 50% 88%) 100%)",
    },
    fonts: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
  },

  // Theme 3: Luxury Gold (Premium/Fashion)
  {
    id: 3,
    slug: "luxury-gold",
    name: "Luxury Gold",
    description: "Elegant champagne and gold - premium and luxurious",
    light: {
      background: "45 35% 90%",
      foreground: "30 25% 10%",
      card: "45 40% 96%",
      cardForeground: "30 25% 10%",
      popover: "45 40% 96%",
      popoverForeground: "30 25% 10%",
      primary: "42 88% 55%",
      primaryForeground: "30 25% 10%",
      secondary: "40 30% 78%",
      secondaryForeground: "30 25% 10%",
      muted: "40 25% 82%",
      mutedForeground: "30 15% 35%",
      accent: "25 60% 50%",
      accentForeground: "0 0% 100%",
      destructive: "0 75% 50%",
      destructiveForeground: "0 0% 100%",
      border: "40 25% 75%",
      input: "40 25% 75%",
      ring: "42 88% 55%",
      radius: "0.5rem",
    },
    dark: {
      background: "0 0% 5%",
      foreground: "0 0% 98%",
      card: "0 0% 9%",
      cardForeground: "0 0% 98%",
      popover: "0 0% 9%",
      popoverForeground: "0 0% 98%",
      primary: "45 93% 50%",
      primaryForeground: "0 0% 9%",
      secondary: "0 0% 15%",
      secondaryForeground: "0 0% 98%",
      muted: "0 0% 15%",
      mutedForeground: "0 0% 64%",
      accent: "45 70% 40%",
      accentForeground: "0 0% 98%",
      destructive: "0 62% 50%",
      destructiveForeground: "0 0% 100%",
      border: "0 0% 18%",
      input: "0 0% 18%",
      ring: "45 93% 50%",
    },
    layout: {
      homeVariant: "luxury",
      headerVariant: "luxury",
      footerVariant: "luxury",
      productCardVariant: "luxury",
    },
    appearance: {
      sectionSpacing: "7rem",
      imageRadius: "0.125rem",
      cardRadius: "0.125rem",
      cardShadow: "0 22px 56px hsl(30 25% 10% / 0.16)",
      buttonRadius: "0.125rem",
      headingTracking: "0.06em",
      textTransform: "uppercase",
    },
    gradients: {
      primary:
        "linear-gradient(135deg, hsl(42 88% 55%) 0%, hsl(38 85% 45%) 100%)",
      secondary:
        "linear-gradient(135deg, hsl(40 30% 78%) 0%, hsl(40 25% 70%) 100%)",
      hero: "linear-gradient(135deg, hsl(45 35% 90%) 0%, hsl(35 30% 85%) 100%)",
    },
    fonts: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
  },

  // Theme 4: Editorial Boutique (Magazine-style premium storefront)
  {
    id: 4,
    slug: "editorial-boutique",
    name: "Editorial Boutique",
    description:
      "Magazine-inspired premium storefront with asymmetric layouts and refined product presentation",
    light: {
      background: "38 22% 96%",
      foreground: "220 18% 10%",
      card: "40 30% 99%",
      cardForeground: "220 18% 10%",
      popover: "40 30% 99%",
      popoverForeground: "220 18% 10%",
      primary: "220 18% 10%",
      primaryForeground: "38 22% 96%",
      secondary: "35 28% 88%",
      secondaryForeground: "220 18% 10%",
      muted: "35 18% 90%",
      mutedForeground: "220 9% 40%",
      accent: "7 72% 55%",
      accentForeground: "0 0% 100%",
      destructive: "0 70% 50%",
      destructiveForeground: "0 0% 100%",
      border: "35 18% 80%",
      input: "35 18% 80%",
      ring: "7 72% 55%",
      radius: "0.25rem",
    },
    dark: {
      background: "220 18% 8%",
      foreground: "38 22% 96%",
      card: "220 16% 12%",
      cardForeground: "38 22% 96%",
      popover: "220 16% 12%",
      popoverForeground: "38 22% 96%",
      primary: "38 22% 96%",
      primaryForeground: "220 18% 8%",
      secondary: "220 12% 18%",
      secondaryForeground: "38 22% 96%",
      muted: "220 12% 18%",
      mutedForeground: "38 12% 70%",
      accent: "7 72% 60%",
      accentForeground: "0 0% 100%",
      destructive: "0 65% 52%",
      destructiveForeground: "0 0% 100%",
      border: "220 12% 24%",
      input: "220 12% 24%",
      ring: "7 72% 60%",
    },
    layout: {
      homeVariant: "editorial",
      headerVariant: "editorial",
      footerVariant: "editorial",
      productCardVariant: "editorial",
    },
    appearance: {
      sectionSpacing: "7.5rem",
      imageRadius: "0.125rem",
      cardRadius: "0.25rem",
      cardShadow: "0 24px 70px hsl(220 18% 10% / 0.14)",
      buttonRadius: "0.125rem",
      headingTracking: "0.02em",
      textTransform: "uppercase",
    },
    gradients: {
      primary:
        "linear-gradient(135deg, hsl(220 18% 10%) 0%, hsl(220 14% 24%) 100%)",
      secondary:
        "linear-gradient(135deg, hsl(38 22% 96%) 0%, hsl(35 28% 88%) 100%)",
      hero: "linear-gradient(135deg, hsl(38 22% 96%) 0%, hsl(18 48% 90%) 100%)",
    },
    fonts: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
  },
];

// Get theme by index (1-based as stored in backend)
export function getThemeByIndex(index: number): Theme {
  const themeIndex = Math.max(0, Math.min(index - 1, themes.length - 1));
  return themes[themeIndex];
}

// Get theme by ID
export function getThemeById(id: number): Theme | undefined {
  return themes.find((theme) => theme.id === id);
}

// Get default theme
export function getDefaultTheme(): Theme {
  return themes[0];
}

// Apply theme to document
export function applyTheme(theme: Theme, isDark: boolean = false): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const colors = isDark ? theme.dark : theme.light;
  root.dataset.theme = theme.slug;

  // Apply CSS custom properties
  root.style.setProperty("--background", colors.background);
  root.style.setProperty("--foreground", colors.foreground);
  root.style.setProperty("--card", colors.card);
  root.style.setProperty("--card-foreground", colors.cardForeground);
  root.style.setProperty("--popover", colors.popover);
  root.style.setProperty("--popover-foreground", colors.popoverForeground);
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--primary-foreground", colors.primaryForeground);
  root.style.setProperty("--secondary", colors.secondary);
  root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
  root.style.setProperty("--muted", colors.muted);
  root.style.setProperty("--muted-foreground", colors.mutedForeground);
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--accent-foreground", colors.accentForeground);
  root.style.setProperty("--destructive", colors.destructive);
  root.style.setProperty(
    "--destructive-foreground",
    colors.destructiveForeground
  );
  root.style.setProperty("--border", colors.border);
  root.style.setProperty("--input", colors.input);
  root.style.setProperty("--ring", colors.ring);
  root.style.setProperty(
    "--theme-section-spacing",
    theme.appearance.sectionSpacing
  );
  root.style.setProperty("--theme-image-radius", theme.appearance.imageRadius);
  root.style.setProperty("--theme-card-radius", theme.appearance.cardRadius);
  root.style.setProperty("--theme-card-shadow", theme.appearance.cardShadow);
  root.style.setProperty(
    "--theme-button-radius",
    theme.appearance.buttonRadius
  );
  root.style.setProperty(
    "--theme-heading-tracking",
    theme.appearance.headingTracking
  );
  root.style.setProperty(
    "--theme-text-transform",
    theme.appearance.textTransform
  );

  // Apply radius only from light theme (shared)
  if (!isDark && "radius" in colors) {
    root.style.setProperty("--radius", (colors as ThemeColors).radius);
  }

  // Apply dark mode class
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export default themes;
