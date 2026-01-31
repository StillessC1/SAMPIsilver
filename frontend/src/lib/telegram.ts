import type { Product, ProductDetail } from "./api";

export interface CartItem {
  product_id: string;
  product: Product | ProductDetail;
  variant_id?: number;
  variant_name?: string;
  sku: string;
  qty: number;
  price: string;
}

const TELEGRAM_BASE = "https://t.me/zxsvgh";

export function buildTelegramOrderText(
  items: CartItem[],
  baseUrl: string,
  lang: "ru" | "uz" = "ru"
): string {
  const lines: string[] = [];
  if (lang === "ru") {
    lines.push("Здравствуйте! Хочу оформить заказ:\n");
  } else {
    lines.push("Assalomu alaykum! Buyurtma bermoqchiman:\n");
  }

  let total = 0;
  for (const item of items) {
    const price = parseFloat(item.price) * item.qty;
    total += price;
    const productUrl = `${baseUrl}/products/${item.product.slug}`;
    lines.push(`• ${item.product.name}`);
    if (item.variant_name) lines.push(`  Вариант: ${item.variant_name}`);
    lines.push(`  SKU: ${item.sku}`);
    lines.push(`  Кол-во: ${item.qty}`);
    lines.push(`  Цена: ${formatPrice(item.price)} × ${item.qty} = ${formatPrice(String(price))}`);
    lines.push(`  ${productUrl}`);
    lines.push("");
  }
  lines.push(`Итого: ${formatPrice(String(total))} UZS`);
  return encodeURIComponent(lines.join("\n"));
}

export function getTelegramOrderUrl(
  items: CartItem[],
  baseUrl: string,
  lang?: "ru" | "uz"
): string {
  const text = buildTelegramOrderText(items, baseUrl, lang);
  return `${TELEGRAM_BASE}?text=${text}`;
}

export function getSupportUrl(): string {
  return TELEGRAM_BASE;
}

export function formatPrice(price: string | number): string {
  const n = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("ru-UZ").format(n);
}
