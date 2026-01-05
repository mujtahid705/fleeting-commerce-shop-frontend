// Theme configuration for multi-tenant white-label e-commerce
// Themes are accessible by index (1, 2, 3) as stored in backend

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
  name: string;
  description: string;
  light: ThemeColors;
  dark: ThemeColorsDark;
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
