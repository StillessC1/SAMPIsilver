import { MetadataRoute } from "next";
import { api } from "@/lib/api";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://sampisilver.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/catalog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/delivery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/care`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/cart`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/wishlist`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

  try {
    const [categoriesRes, productsRes] = await Promise.all([
      api.categories(),
      api.products({ page: 1 }),
    ]);
    const categories = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes as { results?: { slug: string }[] })?.results ?? [];
    const productPages: MetadataRoute.Sitemap = (productsRes.results || []).map((p) => ({
      url: `${BASE}/products/${p.slug}`,
      lastModified: new Date(p.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${BASE}/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
    return [...staticPages, ...categoryPages, ...productPages];
  } catch {
    return staticPages;
  }
}
