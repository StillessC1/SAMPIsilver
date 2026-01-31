"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/telegram";
import { isInWishlist, toggleWishlist } from "@/lib/wishlist";
import type { Product } from "@/lib/api";

export function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLiked(isInWishlist(product.id));
  }, [product.id]);

  useEffect(() => {
    const onWish = () => setLiked(isInWishlist(product.id));
    window.addEventListener("wishlistchange", onWish);
    return () => window.removeEventListener("wishlistchange", onWish);
  }, [product.id]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (mounted) setLiked(toggleWishlist(product));
  };

  const imgSrc = product.main_image || "/placeholder.svg";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden bg-white dark:bg-stone-900 hover:shadow-lg transition"
    >
      <div className="relative aspect-square bg-stone-100 dark:bg-stone-800">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
          sizes="(max-width: 768px) 100vw, 25vw"
          unoptimized={imgSrc.startsWith("http://localhost") || imgSrc.startsWith("http://127.0.0.1")}
        />
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur hover:bg-white dark:hover:bg-stone-800"
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
        {product.old_price && (
          <span className="absolute top-2 left-2 px-2 py-1 rounded bg-amber-500 text-white text-xs font-medium">
            -{Math.round((1 - parseFloat(product.price) / parseFloat(product.old_price)) * 100)}%
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-stone-900 dark:text-white line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-semibold text-stone-800 dark:text-stone-200">
            {formatPrice(product.price)} UZS
          </span>
          {product.old_price && (
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(product.old_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
