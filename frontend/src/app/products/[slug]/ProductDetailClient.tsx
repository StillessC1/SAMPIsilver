"use client";

import { useState, useEffect } from "react";
import { addToCart, getCartCount } from "@/lib/cart";
import { isInWishlist, toggleWishlist } from "@/lib/wishlist";
import { getTelegramOrderUrl } from "@/lib/telegram";
import type { ProductDetail } from "@/lib/api";

export function ProductDetailClient({
  product,
}: {
  product: ProductDetail;
}) {
  const [selectedVariant, setSelectedVariant] = useState<{
    id: number;
    name: string;
    sku: string;
    price_override?: string;
  } | null>(null);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [mounted, setMounted] = useState(false);

  const variants = product.variants || [];
  const mustSelectVariant = variants.length > 0;
  const price = selectedVariant?.price_override || product.price;
  const sku = selectedVariant?.sku || product.sku;

  useEffect(() => {
    setMounted(true);
    setLiked(isInWishlist(product.id));
    if (variants.length === 1) setSelectedVariant(variants[0]);
  }, [product.id, variants]);

  useEffect(() => {
    const onWish = () => setLiked(isInWishlist(product.id));
    window.addEventListener("wishlistchange", onWish);
    return () => window.removeEventListener("wishlistchange", onWish);
  }, [product.id]);

  const handleAddToCart = () => {
    if (mustSelectVariant && !selectedVariant) return;
    addToCart(product, qty, selectedVariant || undefined);
    window.dispatchEvent(new Event("cartchange"));
  };

  const handleWishlist = () => {
    setLiked(toggleWishlist(product));
  };

  const handleOrderTelegram = () => {
    if (mustSelectVariant && !selectedVariant) return;
    const items = [
      {
        product_id: product.id,
        product,
        variant_id: selectedVariant?.id,
        variant_name: selectedVariant?.name,
        sku,
        qty,
        price,
      },
    ];
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    window.open(getTelegramOrderUrl(items, baseUrl, "ru"), "_blank");
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      {mustSelectVariant && (
        <div>
          <label className="block text-sm font-medium mb-2">Выберите вариант</label>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`px-4 py-2 rounded-lg border transition ${
                  selectedVariant?.id === v.id
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                    : "border-stone-200 dark:border-stone-700 hover:border-stone-400"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm">Кол-во:</span>
          <input
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-16 px-2 py-1 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleAddToCart}
          disabled={mustSelectVariant && !selectedVariant}
          className="px-6 py-3 rounded-lg bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 font-medium hover:bg-stone-700 dark:hover:bg-stone-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          В корзину
        </button>
        <button
          onClick={handleWishlist}
          className="p-3 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
          aria-label="В избранное"
        >
          <svg
            className={`w-5 h-5 ${liked ? "fill-rose-500 text-rose-500" : ""}`}
            fill={liked ? "currentColor" : "none"}
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
        </button>
        <button
          type="button"
          onClick={handleOrderTelegram}
          disabled={mustSelectVariant && !selectedVariant}
          className="px-6 py-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
          </svg>
          Заказать в Telegram
        </button>
      </div>
    </div>
  );
}
