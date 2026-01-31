import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productsRes = await api.products({ category: slug });
  const products = productsRes.results || [];
  const categoriesRes = await api.categories();
  const categories = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes as { results?: { slug: string }[] })?.results ?? [];
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-stone-500">Категория не найдена</p>
        <Link href="/catalog" className="text-amber-600 hover:underline mt-4 inline-block">
          К каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">{category.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-stone-500 py-12">
            В этой категории пока нет товаров
          </p>
        ) : (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  );
}
