"use client";

import type { Product, ProductDetail } from "./api";
import type { CartItem } from "./telegram";

const STORAGE_KEY = "sampisilver-cart";

export function getCart(): CartItem[] {
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

export function setCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("cartchange"));
}

export function addToCart(
  product: Product | ProductDetail,
  qty: number = 1,
  variant?: { id: number; name: string; sku: string; price_override?: string }
): void {
  const cart = getCart();
  const price = variant?.price_override || product.price;
  const sku = variant?.sku || product.sku;
  const key = `${product.id}-${variant?.id ?? "base"}`;

  const existing = cart.find(
    (i) => i.product_id === product.id && (i.variant_id ?? null) === (variant?.id ?? null)
  );
  if (existing) {
    existing.qty += qty;
    existing.price = price;
  } else {
    cart.push({
      product_id: product.id,
      product,
      variant_id: variant?.id,
      variant_name: variant?.name,
      sku,
      qty,
      price,
    });
  }
  setCart(cart);
}

export function updateCartItem(index: number, qty: number): void {
  const cart = getCart();
  if (index < 0 || index >= cart.length) return;
  if (qty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].qty = qty;
  }
  setCart(cart);
}

export function removeFromCart(index: number): void {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    setCart(cart);
  }
}

export function getCartCount(): number {
  return getCart().reduce((acc, i) => acc + i.qty, 0);
}
