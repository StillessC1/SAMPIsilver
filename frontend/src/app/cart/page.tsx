"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCart, updateCartItem, removeFromCart } from "@/lib/cart";
import { getTelegramOrderUrl, formatPrice } from "@/lib/telegram";
import type { CartItem } from "@/lib/telegram";
import { t } from "@/lib/i18n";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getCart());
    const onCart = () => setItems(getCart());
    window.addEventListener("cartchange", onCart);
    window.addEventListener("storage", onCart);
    return () => {
      window.removeEventListener("cartchange", onCart);
      window.removeEventListener("storage", onCart);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-stone-500">Загрузка...</p>
      </div>
    );
  }

  const total = items.reduce((acc, i) => acc + parseFloat(i.price) * i.qty, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">{t("cart.title")}</h1>

      {items.length === 0 ? (
        <p className="text-stone-500 mb-6">{t("cart.empty")}</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={`${item.product_id}-${item.variant_id ?? "base"}-${idx}`}
              className="flex gap-4 p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
            >
              <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800">
                <Image
                  src={item.product.main_image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  unoptimized={
                    typeof item.product.main_image === "string" &&
                    (item.product.main_image.startsWith("http://localhost") ||
                      item.product.main_image.startsWith("http://127.0.0.1"))
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-medium hover:underline line-clamp-2"
                >
                  {item.product.name}
                </Link>
                {item.variant_name && (
                  <p className="text-sm text-stone-500">{item.variant_name}</p>
                )}
                <p className="text-sm text-stone-500">SKU: {item.sku}</p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateCartItem(idx, item.qty - 1)}
                      className="w-8 h-8 rounded border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateCartItem(idx, item.qty + 1)}
                      className="w-8 h-8 rounded border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(String(parseFloat(item.price) * item.qty))} UZS
                  </span>
                  <button
                    onClick={() => removeFromCart(idx)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 p-6 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">{t("cart.total")}</span>
            <span className="text-2xl font-bold">
              {formatPrice(String(total))} UZS
            </span>
          </div>
          <a
            href={getTelegramOrderUrl(items, typeof window !== "undefined" ? window.location.origin : "")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
            {t("cart.orderTelegram")}
          </a>
        </div>
      )}

      <Link
        href="/catalog"
        className="inline-block mt-6 text-amber-600 dark:text-amber-500 hover:underline"
      >
        ← Вернуться в каталог
      </Link>
    </div>
  );
}
