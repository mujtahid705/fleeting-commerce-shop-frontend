import HomePage from "@/app/page";
import { themes } from "@/lib/themes";
import { isThemePreviewHostname } from "@/lib/theme-preview";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface ThemePreviewPageProps {
  params: Promise<{
    themeId: string;
  }>;
}

export default async function ThemePreviewPage({
  params,
}: ThemePreviewPageProps) {
  const { themeId } = await params;
  const requestHeaders = await headers();
  const hostname = requestHeaders.get("host")?.split(":")[0] || "";
  const themeIndex = Number(themeId);

  if (
    !isThemePreviewHostname(hostname) ||
    !Number.isInteger(themeIndex) ||
    themeIndex < 1 ||
    themeIndex > themes.length
  ) {
    notFound();
  }

  return <HomePage />;
}
