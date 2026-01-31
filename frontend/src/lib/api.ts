const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  categories: () => fetchApi<{ id: number; name: string; slug: string }[]>(`/categories/`),
  products: (params?: { category?: string; search?: string; ordering?: string; page?: number }) => {
    const sp = new URLSearchParams();
    if (params?.category) sp.set("category", params.category);
    if (params?.search) sp.set("search", params.search);
    if (params?.ordering) sp.set("ordering", params.ordering);
    if (params?.page) sp.set("page", String(params.page));
    return fetchApi<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Product[];
    }>(`/products/?${sp}`);
  },
  product: (slug: string) =>
    fetchApi<ProductDetail>(`/products/${slug}/`),
  related: (slug: string) =>
    fetchApi<Product[]>(`/products/${slug}/related/`),
  reviews: (slug: string) =>
    fetchApi<Review[]>(`/products/${slug}/reviews/`),
  postReview: (slug: string, data: { author_name: string; rating: number; text: string }) =>
    fetchApi<Review>(`/products/${slug}/reviews/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  createOrder: (data: {
    items: { product_id: string; variant_id?: number; qty: number }[];
    customer_name?: string;
    language?: string;
  }) =>
    fetchApi<{ id: number; total_amount: string; status: string }>(`/orders/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  siteSettings: () =>
    fetchApi<SiteSettings>(`/site-settings/`),
};

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string;
  old_price?: string;
  currency: string;
  in_stock: boolean;
  category: number;
  category_name: string;
  main_image: string | null;
  created_at: string;
}

export interface ProductDetail extends Product {
  description: string;
  attributes: Record<string, string>;
  images: { id: number; image: string; sort_order: number; is_main: boolean }[];
  variants: { id: number; name: string; sku: string; price_override?: string; stock?: number }[];
  average_rating: number | null;
  reviews_count: number;
}

export interface Review {
  id: number;
  author_name: string;
  rating: number;
  text: string;
  created_at: string;
}

export interface SiteSettings {
  telegram_username: string;
  contact_text_ru: string;
  contact_text_uz: string;
  about_text_ru: string;
  about_text_uz: string;
  delivery_text_ru: string;
  delivery_text_uz: string;
  care_text_ru: string;
  care_text_uz: string;
}
