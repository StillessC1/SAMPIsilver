import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";
import { CatalogClient } from "./CatalogClient";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; category?: string; ordering?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const search = params.q || "";
  const category = params.category || "";
  const ordering = params.ordering || "-created_at";

  const productsRes = await api.products({
    page,
    search: search || undefined,
    category: category || undefined,
    ordering,
  });
  const products = productsRes.results || [];
  const count = productsRes.count ?? products.length;
  const totalPages = Math.ceil(count / 12) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">Каталог</h1>
      <CatalogClient
        initialCategory={category}
        initialSearch={search}
        initialOrdering={ordering}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Suspense fallback={<div className="col-span-full text-center py-12">Загрузка...</div>}>
          {products.length === 0 ? (
            <p className="col-span-full text-center text-stone-500 py-12">
              Товары не найдены
            </p>
          ) : (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </Suspense>
      </div>
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {page > 1 && (
            <a
              href={`/catalog?page=${page - 1}${search ? `&q=${encodeURIComponent(search)}` : ""}${category ? `&category=${category}` : ""}${ordering !== "-created_at" ? `&ordering=${ordering}` : ""}`}
              className="px-4 py-2 rounded border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              ← Назад
            </a>
          )}
          <span className="px-4 py-2">
            Страница {page} из {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/catalog?page=${page + 1}${search ? `&q=${encodeURIComponent(search)}` : ""}${category ? `&category=${category}` : ""}${ordering !== "-created_at" ? `&ordering=${ordering}` : ""}`}
              className="px-4 py-2 rounded border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Вперёд →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
