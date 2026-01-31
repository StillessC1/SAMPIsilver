import Link from "next/link";
import Image from "next/image";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductReviewForm } from "./ProductReviewForm";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const product = await api.product(slug);
    const img = product.images?.[0]?.image || product.main_image;
    return {
      title: product.name,
      description: product.description?.slice(0, 160) || `Купить ${product.name} — SampiSilver`,
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 160),
        images: img ? [img] : [],
      },
    };
  } catch {
    return { title: "Товар" };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product;
  try {
    product = await api.product(slug);
  } catch {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-stone-500">Товар не найден</p>
        <Link href="/catalog" className="text-amber-600 hover:underline mt-4 inline-block">
          К каталогу
        </Link>
      </div>
    );
  }

  const [reviews, related] = await Promise.all([
    api.reviews(slug),
    api.related(slug),
  ]);

  const mainImage = product.images?.find((i) => i.is_main) || product.images?.[0];
  const imgSrc = mainImage?.image || product.main_image || "/placeholder.svg";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized={
                typeof imgSrc === "string" &&
                (imgSrc.startsWith("http://localhost") || imgSrc.startsWith("http://127.0.0.1"))
              }
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="relative w-20 h-20 shrink-0 rounded overflow-hidden border border-stone-200 dark:border-stone-700"
                >
                  <Image
                    src={img.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized={
                      typeof img.image === "string" &&
                      (img.image.startsWith("http://localhost") ||
                        img.image.startsWith("http://127.0.0.1"))
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-white mb-2">
            {product.name}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-4">SKU: {product.sku}</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-2xl font-bold text-stone-900 dark:text-white">
              {formatPrice(product.price)} UZS
            </span>
            {product.old_price && (
              <span className="text-lg text-stone-400 line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
          </div>
          {product.description && (
            <p className="text-stone-600 dark:text-stone-300 mb-6 whitespace-pre-wrap">
              {product.description}
            </p>
          )}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <dl className="mb-6">
              {Object.entries(product.attributes).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="text-stone-500 capitalize">{k}:</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <ProductDetailClient product={product} />

          <div className="mt-8 pt-8 border-t border-stone-200 dark:border-stone-700">
            <h2 className="font-display text-xl font-bold mb-4">Отзывы</h2>
            {product.average_rating != null && (
              <p className="text-stone-600 dark:text-stone-400 mb-2">
                Средний рейтинг: {product.average_rating.toFixed(1)} ({product.reviews_count}{" "}
                отзывов)
              </p>
            )}
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {reviews.length === 0 ? (
                <p className="text-stone-500">Пока нет отзывов</p>
              ) : (
                reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{r.author_name}</span>
                      <span className="text-amber-500">{"★".repeat(r.rating)}</span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 text-sm">{r.text}</p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Добавить отзыв</h3>
              <ProductReviewForm slug={slug} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-8">Похожие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p as import("@/lib/api").Product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

