"use client";

import { getLang } from "@/lib/i18n";

export function ContentClient({ ru, uz }: { ru: string; uz: string }) {
  const lang = getLang();
  const text = lang === "uz" ? uz : ru;
  if (!text) return null;
  return (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{
        __html: text.replace(/\n/g, "<br />"),
      }}
    />
  );
}
