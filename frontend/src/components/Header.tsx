"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { t, getLang, setLang, type Lang } from "@/lib/i18n";
import { getTheme, toggleTheme } from "@/lib/theme";
import { getCartCount } from "@/lib/cart";
import { getWishlist } from "@/lib/wishlist";
import { getSupportUrl } from "@/lib/telegram";

const categories = [
  { slug: "koltsa", ru: "Кольца", uz: "Uzuklar" },
  { slug: "braslety", ru: "Браслеты", uz: "Bilaguzuklar" },
  { slug: "komplekty", ru: "Комплекты", uz: "To'plamlar" },
  { slug: "tsepochki", ru: "Цепочки", uz: "Zanjirlar" },
];

export function Header() {
  const [lang, setLangState] = useState<Lang>("ru");
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLangState(getLang());
    setThemeState(getTheme());
    setCartCount(getCartCount());
    setWishlistCount(getWishlist().length);

    const onCart = () => setCartCount(getCartCount());
    const onWish = () => setWishlistCount(getWishlist().length);
    window.addEventListener("cartchange", onCart);
    window.addEventListener("storage", onCart);
    window.addEventListener("wishlistchange", onWish);
    return () => {
      window.removeEventListener("cartchange", onCart);
      window.removeEventListener("storage", onCart);
      window.removeEventListener("wishlistchange", onWish);
    };
  }, []);

  useEffect(() => {
    const onLang = () => setLangState(getLang());
    const onTheme = () => setThemeState(getTheme());
    window.addEventListener("langchange", onLang);
    window.addEventListener("themechange", onTheme);
    return () => {
      window.removeEventListener("langchange", onLang);
      window.removeEventListener("themechange", onTheme);
    };
  }, []);

  const handleLang = () => {
    const next = lang === "ru" ? "uz" : "ru";
    setLang(next);
    setLangState(next);
  };

  const handleTheme = () => {
    setThemeState(toggleTheme());
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.svg" alt="SampiSilver" width={36} height={36} />
            <span className="font-display font-bold text-xl text-stone-800 dark:text-stone-200">
              SampiSilver
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition"
              >
                {lang === "ru" ? c.ru : c.uz}
              </Link>
            ))}
            <Link
              href="/about"
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition"
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/delivery"
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition"
            >
              {t("nav.delivery")}
            </Link>
            <Link
              href="/care"
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition"
            >
              {t("nav.care")}
            </Link>
          </nav>

          <form
            action="/catalog"
            className="hidden sm:flex flex-1 max-w-xs"
            onSubmit={(e) => {
              if (!search.trim()) e.preventDefault();
            }}
          >
            <input
              type="search"
              name="q"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search.placeholder")}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-sm"
            />
          </form>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 relative"
              aria-label="Корзина"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/wishlist"
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 relative"
              aria-label="Избранное"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={handleLang}
              className="px-2 py-1 rounded text-sm font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              {lang === "ru" ? "UZ" : "RU"}
            </button>
            <button
              onClick={handleTheme}
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Переключить тему"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <a
              href={getSupportUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium"
            >
              {t("nav.support")}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
