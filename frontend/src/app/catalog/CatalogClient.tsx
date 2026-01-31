"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function CatalogClient({
  initialCategory,
  initialSearch,
  initialOrdering,
}: {
  initialCategory: string;
  initialSearch: string;
  initialOrdering: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <select
        value={searchParams.get("category") || initialCategory || ""}
        onChange={(e) => {
          const p = new URLSearchParams(searchParams.toString());
          if (e.target.value) p.set("category", e.target.value);
          else p.delete("category");
          p.delete("page");
          router.push(`/catalog?${p}`);
        }}
        className="px-3 py-2 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
      >
        <option value="">Все категории</option>
        <option value="koltsa">Кольца</option>
        <option value="braslety">Браслеты</option>
        <option value="komplekty">Комплекты</option>
        <option value="tsepochki">Цепочки</option>
      </select>
      <select
        value={searchParams.get("ordering") || initialOrdering}
        onChange={(e) => {
          const p = new URLSearchParams(searchParams.toString());
          p.set("ordering", e.target.value);
          p.delete("page");
          router.push(`/catalog?${p}`);
        }}
        className="px-3 py-2 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
      >
        <option value="-created_at">Сначала новые</option>
        <option value="created_at">Сначала старые</option>
        <option value="price">Цена: по возрастанию</option>
        <option value="-price">Цена: по убыванию</option>
        <option value="name">По имени А-Я</option>
        <option value="-name">По имени Я-А</option>
      </select>
    </div>
  );
}
