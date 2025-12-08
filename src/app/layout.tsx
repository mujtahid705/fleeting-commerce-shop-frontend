import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ReduxProvider } from "@/redux/Providers";
import { Toaster } from "sonner";
import { TopLoader } from "@/components/top-loader";
import { Suspense } from "react";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Fleeting Commerce - Your Modern Shopping Experience",
  description:
    "Discover the latest trends in fashion with our exclusive Fleeting Commerce collection designed for the modern lifestyle.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <TopLoader />
          <div className="min-h-screen flex flex-col">
            <Header />
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading...</p>
                  </div>
                </div>
              }
            >
              {children}
            </Suspense>
            <Footer />
          </div>
          <Toaster
            position="bottom-right"
            expand={true}
            richColors={true}
            closeButton={true}
            toastOptions={{
              style: {
                background: "#ffffff",
                color: "#1f2937",
                border: "1px solid #e5e7eb",
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
        </ReduxProvider>
      </body>
    </html>
  );
}
