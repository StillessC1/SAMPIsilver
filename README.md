# SampiSilver — Онлайн-магазин серебряных украшений

Монорепозиторий: Django (backend) + Next.js (frontend).

## Структура проекта

```
SampiSilver/
├── backend/          # Django + DRF API
├── frontend/         # Next.js + TypeScript + Tailwind
└── render.yaml       # Конфигурация деплоя Render
```

---

## Быстрый старт

### Требования

- Python 3.12+
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend

# Создать виртуальное окружение
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate   # Linux/Mac

# Установить зависимости
pip install -r requirements.txt

# Скопировать env и настроить
copy env.example .env   # Windows
# cp env.example .env   # Linux/Mac

# Создать БД PostgreSQL: sampisilver
# Настроить .env: PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT

# Миграции
python manage.py migrate

# Создать суперпользователя (для админки)
python manage.py createsuperuser

# Заполнить данные
python manage.py seed

# Запуск
python manage.py runserver
# API: http://localhost:8000
# Admin: http://localhost:8000/admin
```

### Frontend

```bash
cd frontend

# Установить зависимости
npm install

# Скопировать env
copy env.example .env.local   # Windows
# cp env.example .env.local   # Linux/Mac

# Добавить в .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Запуск
npm run dev
# Сайт: http://localhost:3000
```

---

## Переменные окружения

### Backend (`backend/.env` или env в Render)

| Переменная | Описание | Пример |
|------------|----------|--------|
| `SECRET_KEY` | Секретный ключ Django | любая случайная строка |
| `DEBUG` | Режим отладки | `False` (prod) |
| `ALLOWED_HOSTS` | Разрешённые хосты | `localhost,.onrender.com` |
| `PGDATABASE` | Имя БД PostgreSQL | `sampisilver` |
| `PGUSER` | Пользователь БД | `postgres` |
| `PGPASSWORD` | Пароль БД | — |
| `PGHOST` | Хост БД | `localhost` / хост Render |
| `PGPORT` | Порт БД | `5432` |
| `DATABASE_URL` | Полный URL БД (Render) | `postgresql://...` |
| `CORS_ALLOWED_ORIGINS` | CORS origins | `http://localhost:3000,https://your-app.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | CSRF trusted | `http://localhost:3000,https://your-app.vercel.app` |
| `CLOUDINARY_URL` | Cloudinary (опционально) | `cloudinary://...` |

### Frontend (`frontend/.env.local` или env в Vercel)

| Переменная | Описание | Пример |
|------------|----------|--------|
| `NEXT_PUBLIC_API_URL` | URL API | `http://localhost:8000/api` |
| `NEXT_PUBLIC_SITE_URL` | URL сайта (sitemap) | `https://your-app.vercel.app` |

---

## Деплой

### Backend на Render

1. Создайте аккаунт на [Render.com](https://render.com)
2. New → Blueprint (из репозитория) или New → Web Service
3. Подключите репозиторий GitHub
4. Укажите:
   - **Root Directory**: оставьте пустым
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Docker Context**: `backend`
5. Добавьте PostgreSQL: New → PostgreSQL
6. В настройках сервиса добавьте env:
   - `DATABASE_URL` — из Internal Database URL
   - `SECRET_KEY` — сгенерируйте
   - `CORS_ALLOWED_ORIGINS` — URL вашего frontend (Vercel)
   - `CSRF_TRUSTED_ORIGINS` — то же
   - `ALLOWED_HOSTS` — `.onrender.com`
7. Деплой. После первого деплоя выполните:
   - В Render Shell: `python manage.py createsuperuser`
   - `python manage.py seed`

### Frontend на Vercel

1. [Vercel](https://vercel.com) → Import Project
2. Root Directory: `frontend`
3. Framework: Next.js (авто)
4. Env: `NEXT_PUBLIC_API_URL` = URL вашего backend (Render)
5. Env: `NEXT_PUBLIC_SITE_URL` = URL Vercel (для sitemap)
6. Deploy

---

## Админка Django

- URL: `https://your-backend.onrender.com/admin`
- Логин/пароль: от `createsuperuser`

### Возможности

- **Категории**: CRUD, slug
- **Товары**: CRUD, inline изображения и варианты, slug, фильтры
- **Отзывы**: модерация (approve), bulk actions
- **Заказы**: смена статуса, bulk actions
- **SiteSettings**: контакт, о нас, доставка, уход за серебром

---

## Заказ через Telegram

1. Пользователь добавляет товары в корзину
2. Нажимает «Заказать в Telegram»
3. Открывается `https://t.me/zxsvgh?text=...` с prefilled текстом:
   - список товаров
   - SKU, вариант, количество, цена
   - итог
   - ссылки на страницы товаров
4. Никакой авто-отправки — пользователь нажимает «Отправить» в Telegram

Тех поддержка: [t.me/zxsvgh](https://t.me/zxsvgh)

---

## API

- `GET /api/categories/` — категории
- `GET /api/products/?category=&search=&ordering=&page=` — товары (пагинация)
- `GET /api/products/<slug>/` — товар
- `GET /api/products/<slug>/related/` — похожие
- `GET /api/products/<slug>/reviews/` — отзывы
- `POST /api/products/<slug>/reviews/` — добавить отзыв
- `POST /api/orders/` — создать заказ
- `GET /api/site-settings/` — настройки сайта
- `GET /api/health/` — health check

OpenAPI: `/api/schema/`, Swagger: `/api/docs/`

---

## Функционал

- Каталог с фильтрами и поиском
- Страница товара с галереей, вариантами, отзывами
- Корзина (localStorage)
- Избранное (localStorage)
- i18n RU/UZ
- Тёмная/светлая тема
- SEO: metadata, OpenGraph, sitemap.xml, robots.txt
