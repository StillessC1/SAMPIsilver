const STORAGE_KEY = "sampisilver-lang";

export type Lang = "ru" | "uz";

const translations: Record<Lang, Record<string, string>> = {
  ru: {
    "nav.catalog": "Каталог",
    "nav.about": "О нас",
    "nav.delivery": "Доставка и оплата",
    "nav.care": "Уход за серебром",
    "nav.support": "Тех поддержка",
    "hero.title": "Серебряные украшения",
    "hero.subtitle": "925 проба. Уникальный дизайн.",
    "category.rings": "Кольца",
    "category.bracelets": "Браслеты",
    "category.sets": "Комплекты",
    "category.chains": "Цепочки",
    "product.addToCart": "В корзину",
    "product.addToWishlist": "В избранное",
    "product.orderTelegram": "Заказать в Telegram",
    "product.reviews": "Отзывы",
    "product.addReview": "Добавить отзыв",
    "cart.title": "Корзина",
    "cart.empty": "Корзина пуста",
    "cart.total": "Итого",
    "cart.orderTelegram": "Заказать в Telegram",
    "wishlist.title": "Избранное",
    "wishlist.empty": "Нет избранных товаров",
    "search.placeholder": "Поиск...",
    "new": "Новинки",
    "popular": "Популярные",
  },
  uz: {
    "nav.catalog": "Katalog",
    "nav.about": "Biz haqimizda",
    "nav.delivery": "Yetkazib berish va to'lov",
    "nav.care": "Kumushga g'amxo'rlik",
    "nav.support": "Texnik yordam",
    "hero.title": "Kumush zargarlik buyumlari",
    "hero.subtitle": "925 proba. Noyob dizayn.",
    "category.rings": "Uzuklar",
    "category.bracelets": "Bilaguzuklar",
    "category.sets": "To'plamlar",
    "category.chains": "Zanjirlar",
    "product.addToCart": "Savatga",
    "product.addToWishlist": "Sevimlilar",
    "product.orderTelegram": "Telegram orqali buyurtma",
    "product.reviews": "Sharhlar",
    "product.addReview": "Sharh qo'shish",
    "cart.title": "Savat",
    "cart.empty": "Savat bo'sh",
    "cart.total": "Jami",
    "cart.orderTelegram": "Telegram orqali buyurtma",
    "wishlist.title": "Sevimlilar",
    "wishlist.empty": "Sevimli mahsulotlar yo'q",
    "search.placeholder": "Qidiruv...",
    "new": "Yangiliklar",
    "popular": "Mashhurlar",
  },
};

export function getLang(): Lang {
  if (typeof window === "undefined") return "ru";
  return (localStorage.getItem(STORAGE_KEY) as Lang) || "ru";
}

export function setLang(lang: Lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  window.dispatchEvent(new Event("langchange"));
}

export function t(key: string, lang?: Lang): string {
  const l = lang ?? (typeof window !== "undefined" ? getLang() : "ru");
  return translations[l]?.[key] ?? key;
}
