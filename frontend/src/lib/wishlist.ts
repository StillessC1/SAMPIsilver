"use client";

import type { Product, ProductDetail } from "./api";

const STORAGE_KEY = "sampisilver-wishlist";

export function getWishlist(): (Product | ProductDetail)[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setWishlist(items: (Product | ProductDetail)[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("wishlistchange"));
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().some((p) => p.id === productId);
}

export function toggleWishlist(product: Product | ProductDetail): boolean {
  const list = getWishlist();
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    list.splice(idx, 1);
    setWishlist(list);
    return false;
  } else {
    list.push(product);
    setWishlist(list);
    return true;
  }
}
