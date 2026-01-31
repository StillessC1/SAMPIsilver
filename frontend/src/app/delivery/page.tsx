import { api } from "@/lib/api";
import { ContentClient } from "@/components/ContentClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Доставка и оплата",
  description: "Условия доставки и оплаты SampiSilver",
};

export default async function DeliveryPage() {
  const settings = await api.siteSettings();
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">Доставка и оплата</h1>
      <ContentClient
        ru={settings.delivery_text_ru}
        uz={settings.delivery_text_uz}
      />
      {!settings.delivery_text_ru && !settings.delivery_text_uz && (
        <p className="text-stone-500">Контент пока не добавлен.</p>
      )}
    </div>
  );
}
