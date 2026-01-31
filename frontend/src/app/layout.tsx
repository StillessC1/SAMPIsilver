import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { ThemeScript } from "@/components/ThemeScript";

export const metadata: Metadata = {
  title: { default: "SampiSilver — Серебряные украшения", template: "%s | SampiSilver" },
  description:
    "Онлайн-магазин серебряных украшений 925 пробы. Кольца, браслеты, цепочки, комплекты.",
  openGraph: {
    title: "SampiSilver — Серебряные украшения",
    description: "Онлайн-магазин серебряных украшений 925 пробы.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen antialiased bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
