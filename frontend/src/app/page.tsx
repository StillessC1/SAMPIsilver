import Link from "next/link";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { t } from "@/lib/i18n";

const categorySlugToName: Record<string, { ru: string; uz: string }> = {
  koltsa: { ru: "Кольца", uz: "Uzuklar" },
  braslety: { ru: "Браслеты", uz: "Bilaguzuklar" },
  komplekty: { ru: "Комплекты", uz: "To'plamlar" },
  tsepochki: { ru: "Цепочки", uz: "Zanjirlar" },
};

export default async function HomePage() {
  const [categoriesRes, productsRes] = await Promise.all([
    api.categories(),
    api.products({ ordering: "-created_at", page: 1 }),
  ]);
  const categories = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes as { results?: unknown[] })?.results ?? [];
  const products = productsRes.results || [];

  return (
    <div>
      <section className="relative py-24 px-4 bg-gradient-to-b from-stone-100 to-stone-50 dark:from-stone-900 dark:to-stone-950">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-stone-900 dark:text-white mb-4">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <Link
            href="/catalog"
            className="inline-block mt-8 px-8 py-3 rounded-lg bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 font-medium hover:bg-stone-700 dark:hover:bg-stone-300 transition"
          >
            {t("nav.catalog")}
          </Link>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-8">{t("nav.catalog")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="block p-6 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-amber-400 dark:hover:border-amber-500 transition text-center"
              >
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-8">{t("new")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/catalog"
              className="text-amber-600 dark:text-amber-500 hover:underline font-medium"
            >
              Смотреть все →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
