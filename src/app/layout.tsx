import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/Providers";
import { Toaster } from "sonner";
import { TopLoader } from "@/components/top-loader";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreLayout } from "@/components/store-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store - Your Shopping Experience",
  description: "Discover amazing products at great prices.",
};

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
