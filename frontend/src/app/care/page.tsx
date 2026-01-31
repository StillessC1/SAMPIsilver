import { api } from "@/lib/api";
import { ContentClient } from "@/components/ContentClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Уход за серебром",
  description: "Рекомендации по уходу за серебряными украшениями",
};

export default async function CarePage() {
  const settings = await api.siteSettings();
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">Уход за серебром</h1>
      <ContentClient
        ru={settings.care_text_ru}
        uz={settings.care_text_uz}
      />
      {!settings.care_text_ru && !settings.care_text_uz && (
        <p className="text-stone-500">Контент пока не добавлен.</p>
      )}
    </div>
  );
}
