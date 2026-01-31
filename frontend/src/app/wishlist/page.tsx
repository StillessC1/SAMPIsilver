"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getWishlist } from "@/lib/wishlist";
import { t } from "@/lib/i18n";
import type { Product } from "@/lib/api";

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getWishlist() as Product[]);
    const onWish = () => setItems(getWishlist() as Product[]);
    window.addEventListener("wishlistchange", onWish);
    return () => window.removeEventListener("wishlistchange", onWish);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-stone-500">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">{t("wishlist.title")}</h1>

      {items.length === 0 ? (
        <p className="text-stone-500 mb-6">{t("wishlist.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Link
        href="/catalog"
        className="inline-block mt-8 text-amber-600 dark:text-amber-500 hover:underline"
      >
        ← Вернуться в каталог
      </Link>
    </div>
  );
}
