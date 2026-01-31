import { api } from "@/lib/api";
import { ContentClient } from "@/components/ContentClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "О нас",
  description: "SampiSilver — магазин серебряных украшений 925 пробы",
};

export default async function AboutPage() {
  const settings = await api.siteSettings();
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">О нас</h1>
      <ContentClient
        ru={settings.about_text_ru}
        uz={settings.about_text_uz}
      />
      {!settings.about_text_ru && !settings.about_text_uz && (
        <p className="text-stone-500">Контент пока не добавлен.</p>
      )}
    </div>
  );
}
