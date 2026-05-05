import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { ReduxProvider } from "@/redux/Providers";
import { Toaster } from "sonner";
import { TopLoader } from "@/components/top-loader";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreLayout } from "@/components/store-layout";
import type { TenantInfo } from "@/redux/slices/tenantSlice";

const inter = Inter({ subsets: ["latin"] });

const DEFAULT_TITLE = "Store - Your Shopping Experience";
const DEFAULT_DESCRIPTION = "Discover amazing products at great prices.";

const DEFAULT_METADATA: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
};

function extractDomainFromHost(host: string): string | null {
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");

  if (hostname.includes("localhost")) {
    return parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "www"
      ? parts[0]
      : null;
  }

  return parts.length >= 3 && parts[0] !== "www" ? parts[0] : null;
}

async function getTenantForMetadata(): Promise<TenantInfo | null> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "";
  const domain = extractDomainFromHost(host);

  if (!domain) {
    return null;
  }

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api";
    const response = await fetch(
      `${apiUrl}/tenants/storefront?domain=${encodeURIComponent(domain)}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          Pragma: "no-cache",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return (result.data as TenantInfo) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantForMetadata();

  if (!tenant) {
    return DEFAULT_METADATA;
  }

  const title = tenant.brand.tagline
    ? `${tenant.name} - ${tenant.brand.tagline}`
    : tenant.name;
  const description = tenant.brand.description || DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    icons: tenant.brand.logoUrl
      ? {
          icon: tenant.brand.logoUrl,
          shortcut: tenant.brand.logoUrl,
        }
      : undefined,
    openGraph: {
      title,
      description,
      images: tenant.brand.logoUrl ? [tenant.brand.logoUrl] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProvider>
            <TopLoader />
            <StoreLayout>{children}</StoreLayout>
            <Toaster
              position="bottom-right"
              expand={true}
              richColors={true}
              closeButton={true}
              toastOptions={{
                style: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "500",
                  padding: "16px",
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  backdropFilter: "blur(8px)",
                },
                className: "fleeting-toast",
                duration: 4000,
              }}
              theme="light"
              offset={20}
            />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
