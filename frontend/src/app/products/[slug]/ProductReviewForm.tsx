"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function ProductReviewForm({ slug }: { slug: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const author_name = fd.get("author_name") as string;
    const rating = parseInt(fd.get("rating") as string, 10);
    const text = fd.get("text") as string;
    if (!author_name?.trim() || !text?.trim() || !rating) {
      setError("Заполните все поля");
      return;
    }
    try {
      await api.postReview(slug, { author_name: author_name.trim(), rating, text: text.trim() });
      setSent(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    }
  }

  if (sent) {
    return (
      <p className="text-green-600 dark:text-green-400">
        Спасибо! Ваш отзыв отправлен на модерацию.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="text"
        name="author_name"
        placeholder="Ваше имя"
        required
        className="w-full px-3 py-2 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
      />
      <select
        name="rating"
        required
        className="w-full px-3 py-2 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
      >
        <option value="">Оценка</option>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} ★
          </option>
        ))}
      </select>
      <textarea
        name="text"
        placeholder="Текст отзыва"
        required
        rows={3}
        className="w-full px-3 py-2 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-300"
      >
        Отправить
      </button>
    </form>
  );
}
